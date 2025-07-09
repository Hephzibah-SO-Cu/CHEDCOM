export async function uploadToReImage(file: File, tags: string[] = []): Promise<{ url: string, assetId: string }> {
  const formData = new FormData();
  const safeTags = tags.map(tag => tag.replace(/['"`“”]/g, '').trim());
  // safeTags.forEach(tag => formData.append('tags', tag));
  formData.append('file', file);
  formData.append('tags', safeTags.join(','));


  const res = await fetch('https://api.reimage.dev/upload/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_REIMAGE_KEY || ''}`,
    },
    body: formData,
  });

  if (!res.ok) {
    console.error('Upload failed:', await res.text());
    throw new Error('Failed to upload file to ReImage');
  }

  const data = await res.json();
  console.log('ReImage response:', data);
  return {
    url: data.original, // image URL
    assetId: data.object_id    // asset ID
  };
}
