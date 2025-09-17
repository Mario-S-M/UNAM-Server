import { NextRequest } from 'next/server';
import { handleFileUpload } from '@/lib/uploadthing';

export async function POST(request: NextRequest) {
  return handleFileUpload(request);
}
