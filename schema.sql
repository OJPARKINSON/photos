CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  image_key TEXT NOT NULL,
  thumb_key TEXT NOT NULL,
  type TEXT DEFAULT 'photo',
  camera TEXT,
  lens TEXT,
  aperture TEXT,
  exposure TEXT,
  focal_length TEXT,
  iso TEXT,
  make TEXT,
  tags TEXT,
  blur_data TEXT
);

CREATE INDEX idx_photos_date ON photos(date DESC);
CREATE INDEX idx_photos_slug ON photos(slug);