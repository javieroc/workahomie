import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea, inputClass } from '@/components/ui/Field';
import { Avatar } from '@/components/ui/misc';
import { useSaveProfile } from '@/features/hosts/api';
import { apiErrorMessage } from '@/lib/api';
import { OCCUPATIONS, titleCase } from '@/lib/occupations';
import type { Host } from '@/lib/types';

const schema = z
  .object({
    firstName: z.string().trim().min(1, 'Required').max(60),
    lastName: z.string().trim().min(1, 'Required').max(60),
    occupation: z.string().min(1, 'Pick one'),
    occupationDescription: z.string().trim().max(80).optional(),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ()-]{7,20}$/, 'Use international format, e.g. +353 85 123 4567'),
    aboutMe: z.string().trim().max(1000).optional(),
  })
  .refine((v) => v.occupation !== 'others' || Boolean(v.occupationDescription), {
    path: ['occupationDescription'],
    message: 'Tell guests what you do',
  });

type Values = z.infer<typeof schema>;

export function ProfileForm({
  host,
  onSaved,
  defaults,
}: {
  host?: Host | null;
  onSaved?: (h: Host) => void;
  defaults?: Partial<Values>;
}) {
  const mode = host ? 'update' : 'create';
  const save = useSaveProfile(mode);
  const [photo, setPhoto] = useState<File | null>(null);
  const preview = useMemo(() => (photo ? URL.createObjectURL(photo) : undefined), [photo]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: host?.firstName ?? defaults?.firstName ?? '',
      lastName: host?.lastName ?? defaults?.lastName ?? '',
      occupation: host?.occupation ?? '',
      occupationDescription: host?.occupationDescription ?? '',
      phone: host?.phone ?? '',
      aboutMe: host?.aboutMe ?? '',
    },
  });

  const onSubmit = handleSubmit((values) =>
    save.mutate(
      { ...values, profile: photo },
      {
        onSuccess: (h) => {
          toast.success(
            mode === 'create' ? 'Welcome, host! Now add your workspace.' : 'Profile saved',
          );
          setPhoto(null);
          onSaved?.(h);
        },
        onError: (e) => toast.error(apiErrorMessage(e, 'Could not save your profile')),
      },
    ),
  );

  const name = `${watch('firstName')} ${watch('lastName')}`.trim() || 'You';

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-6" noValidate>
      <div className="flex items-center gap-5">
        <Avatar src={preview ?? host?.profileImages?.[0]} name={name} className="size-20" />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium hover:border-ink/30">
          <Camera className="size-4" />{' '}
          {host?.profileImages?.[0] || photo ? 'Change photo' : 'Add a photo'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
          <Input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            {...register('firstName')}
          />
        </Field>
        <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
          <Input
            id="lastName"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            {...register('lastName')}
          />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What do you do?" htmlFor="occupation" error={errors.occupation?.message}>
          <select
            id="occupation"
            className={inputClass}
            aria-invalid={!!errors.occupation}
            {...register('occupation')}
          >
            <option value="">Choose…</option>
            {OCCUPATIONS.map((o) => (
              <option key={o.name} value={o.name}>
                {titleCase(o.name)}
              </option>
            ))}
          </select>
        </Field>
        {watch('occupation') === 'others' && (
          <Field
            label="Your occupation"
            htmlFor="occupationDescription"
            error={errors.occupationDescription?.message}
          >
            <Input id="occupationDescription" {...register('occupationDescription')} />
          </Field>
        )}
      </div>
      <Field
        label="Phone (WhatsApp)"
        htmlFor="phone"
        hint="Only shared with guests you accept."
        error={errors.phone?.message}
      >
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          aria-invalid={!!errors.phone}
          {...register('phone')}
        />
      </Field>
      <Field
        label="About you"
        htmlFor="aboutMe"
        hint="A few lines help guests say hello."
        error={errors.aboutMe?.message}
      >
        <Textarea id="aboutMe" {...register('aboutMe')} />
      </Field>
      <div>
        <Button
          type="submit"
          variant="ink"
          size="lg"
          loading={save.isPending}
          disabled={mode === 'update' && !isDirty && !photo}
        >
          {mode === 'create' ? 'Create host profile' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
