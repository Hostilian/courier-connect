import mongoose from 'mongoose';

const RAW_MONGODB_URI = process.env.MONGODB_URI?.trim();
const FALLBACK_LOCAL_URI = 'mongodb://127.0.0.1:27017/courier-connect';
const hasScheme = RAW_MONGODB_URI?.startsWith('mongodb://') || RAW_MONGODB_URI?.startsWith('mongodb+srv://');
const NORMALIZED_URI = RAW_MONGODB_URI && hasScheme ? RAW_MONGODB_URI : RAW_MONGODB_URI ? `mongodb+srv://${RAW_MONGODB_URI}` : undefined;

const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
const isVercelPreview = process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'preview';
let warnedMissingUri = false;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  const shouldUseLocalFallback = !NORMALIZED_URI && process.env.NODE_ENV !== 'production';
  const shouldSkipConnection = !NORMALIZED_URI && !shouldUseLocalFallback;

  if (shouldSkipConnection) {
    if (!warnedMissingUri) {
      console.warn('MONGODB_URI is not configured. Skipping database connection during build/runtime without credentials.');
      warnedMissingUri = true;
    }

    if (isBuildTime || isVercelPreview || process.env.NODE_ENV === 'test') {
      cached.conn = cached.conn || mongoose;
      return cached.conn;
    }

    throw new Error('MONGODB_URI is not defined. Please add it to your environment variables.');
  }

  const connectionString = shouldUseLocalFallback ? FALLBACK_LOCAL_URI : NORMALIZED_URI!;

  if (shouldUseLocalFallback && !warnedMissingUri) {
    console.warn(`MONGODB_URI not set; using local fallback at ${FALLBACK_LOCAL_URI}.`);
    warnedMissingUri = true;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(connectionString, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
