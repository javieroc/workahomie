import { ImagePlus, MapPin, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router';
import { toast } from 'sonner';
import { LocationPicker } from '@/components/map/LocationPicker';
import { PlaceSearch } from '@/components/PlaceSearch';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { Img } from '@/components/ui/misc';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { useHostMe, useSavePlace } from '@/features/hosts/api';
import { apiErrorMessage } from '@/lib/api';
import { cn } from '@/lib/cn';
import { reverseGeocode } from '@/lib/geocode';
import { parseAddress, toLngLat } from '@/lib/geo';
import { titleCase } from '@/lib/occupations';
import { FACILITIES } from '@/lib/types';

const MAX_PHOTOS = 10;

export default function PlacePage() {
  const { data: host, isLoading } = useHostMe();
  if (isLoading) return <FullPageSpinner />;
  if (!host) return <Navigate to="/me/profile" replace />;
  return <PlaceForm key={host._id} />;
}

function PlaceForm() {
  const { data: host } = useHostMe();
  const save = useSavePlace();
  const initialAddress = parseAddress(host?.address);
  const initialLngLat = toLngLat(host?.location);

  const [title, setTitle] = useState(host?.placeDescription ?? '');
  const [details, setDetails] = useState(host?.placeDetails ?? '');
  const [facilities, setFacilities] = useState<string[]>(host?.facilities ?? []);
  const [label, setLabel] = useState(initialAddress.label);
  const [point, setPoint] = useState<{ lat: number; lng: number } | undefined>(
    initialLngLat ? { lng: initialLngLat[0], lat: initialLngLat[1] } : undefined,
  );
  const [existing, setExisting] = useState<string[]>(host?.pictures ?? []);
  const [added, setAdded] = useState<File[]>([]);
  const previews = useMemo(() => added.map((f) => URL.createObjectURL(f)), [added]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const errors = {
    title: !title.trim() ? 'Give your space a short title' : undefined,
    location: !point ? 'Search an address or drop the pin on the map' : undefined,
  };
  const valid = !errors.title && !errors.location;

  const onPinMoved = async (p: { lat: number; lng: number }) => {
    setPoint(p);
    try {
      setLabel((await reverseGeocode(p.lat, p.lng)).display_name);
    } catch {
      setLabel(`${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`);
    }
  };

  const submit = () => {
    if (!valid || !point) return;
    save.mutate(
      {
        placeDescription: title.trim(),
        placeDetails: details.trim(),
        facilities,
        address: { display_name: label, lat: String(point.lat), lon: String(point.lng) },
        existingPictures: existing,
        newPictures: added,
      },
      {
        onSuccess: () => {
          setAdded([]);
          toast.success('Workspace saved — it’s on the map');
        },
        onError: (e) => toast.error(apiErrorMessage(e, 'Could not save the workspace')),
      },
    );
  };

  const photoCount = existing.length + added.length;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="grid gap-8">
        <div>
          <h2 className="text-2xl font-semibold">Your workspace</h2>
          <p className="mt-1 text-muted">
            Guests see an approximate area; the exact address is shared after you accept.
          </p>
        </div>

        <Field label="Title" htmlFor="title" error={title ? undefined : errors.title}>
          <Input
            id="title"
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sunny desk by the window"
          />
        </Field>
        <Field
          label="Describe the space"
          htmlFor="details"
          hint="Desk, chair, noise level, pets, house rules…"
        >
          <Textarea
            id="details"
            value={details}
            maxLength={2000}
            onChange={(e) => setDetails(e.target.value)}
          />
        </Field>

        <fieldset>
          <legend className="text-sm font-medium text-ink-2">Amenities</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {FACILITIES.map((f) => {
              const on = facilities.includes(f);
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    setFacilities((xs) => (on ? xs.filter((x) => x !== f) : [...xs, f]))
                  }
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition',
                    on ? 'border-ink bg-ink text-paper' : 'border-line bg-card hover:border-ink/40',
                  )}
                >
                  {titleCase(f)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <p className="text-sm font-medium text-ink-2">
            Photos{' '}
            <span className="font-normal text-muted">
              ({photoCount}/{MAX_PHOTOS})
            </span>
          </p>
          <ul className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {existing.map((url) => (
              <PhotoTile
                key={url}
                src={url}
                onRemove={() => setExisting((xs) => xs.filter((x) => x !== url))}
              />
            ))}
            {previews.map((url, i) => (
              <PhotoTile
                key={url}
                src={url}
                isNew
                onRemove={() => setAdded((xs) => xs.filter((_, j) => j !== i))}
              />
            ))}
            {photoCount < MAX_PHOTOS && (
              <li>
                <label className="grid aspect-square cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-line text-muted transition hover:border-magenta hover:text-magenta">
                  <span className="flex flex-col items-center gap-1 text-sm">
                    <ImagePlus className="size-6" /> Add
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []).filter(
                        (f) => f.size <= 8 * 1024 * 1024,
                      );
                      if (files.length < (e.target.files?.length ?? 0))
                        toast.warning('Photos over 8 MB were skipped');
                      setAdded((xs) => [...xs, ...files].slice(0, MAX_PHOTOS - existing.length));
                      e.target.value = '';
                    }}
                  />
                </label>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid content-start gap-4 lg:sticky lg:top-24">
        <p className="text-sm font-medium text-ink-2">Location</p>
        <PlaceSearch
          allowLocate
          placeholder="Search your street address"
          defaultValue={label}
          onSelect={(p) => {
            setPoint({ lat: p.lat, lng: p.lng });
            setLabel(p.id === 'me' ? label : p.label);
            if (p.id === 'me') void onPinMoved({ lat: p.lat, lng: p.lng });
          }}
        />
        <LocationPicker
          value={point}
          onChange={(p) => void onPinMoved(p)}
          className="h-80 overflow-hidden rounded-3xl border border-line"
        />
        <p className={cn('flex items-start gap-2 text-sm', point ? 'text-ink-2' : 'text-danger')}>
          <MapPin className="mt-0.5 size-4 shrink-0" />
          {point ? label || 'Pin placed' : errors.location}
        </p>
        <p className="text-xs text-muted">
          Tip: drag the pin or tap the map to fine-tune the spot.
        </p>
        <div className="mt-2 flex gap-3">
          <Button
            variant="ink"
            size="lg"
            className="flex-1"
            disabled={!valid}
            loading={save.isPending}
            onClick={submit}
          >
            Save workspace
          </Button>
          {host && (
            <ButtonLink to={`/hosts/${host._id}`} variant="outline" size="lg">
              Preview
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}

function PhotoTile({
  src,
  onRemove,
  isNew,
}: {
  src: string;
  onRemove: () => void;
  isNew?: boolean;
}) {
  return (
    <li className="group relative aspect-square overflow-hidden rounded-2xl">
      <Img src={src} alt="Workspace photo" className="size-full" />
      {isNew && (
        <span className="absolute left-2 top-2 rounded-full bg-magenta px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
          New
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove photo"
        className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-ink/80 text-paper opacity-90 transition hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </li>
  );
}
