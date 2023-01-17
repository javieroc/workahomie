db = db.getSiblingDB('workahomie')

db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [{ role: 'readWrite', db: 'workahomie' }],
});

db.createCollection('hosts')
