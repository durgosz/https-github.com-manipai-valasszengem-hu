import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const imageId = formData.get('imageId') as string | null

  if (!file || !imageId) {
    return NextResponse.json({ error: 'Hiányzó fájl vagy imageId' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const fileName = `${imageId}.${ext}`

  const bytes = await file.arrayBuffer()
  const buffer = new Uint8Array(bytes)

  const admin = createAdminClient()

  const { error: uploadError } = await admin.storage
    .from('site-images')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const {
    data: { publicUrl },
  } = admin.storage.from('site-images').getPublicUrl(fileName)

  await admin.from('site_images').upsert({
    id: imageId,
    storage_path: fileName,
    public_url: publicUrl,
    updated_at: new Date().toISOString(),
  })

  return NextResponse.json({ url: publicUrl })
}
