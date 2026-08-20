import { Platform } from 'react-native';

export async function appendSourceToFormData(
  formData: FormData,
  field: string,
  source: { uri: string; name?: string; type?: string },
  defaultName: string,
) {
  const filename = source.name ?? source.uri.split('/').pop() ?? defaultName;
  const ext = filename.split('.').pop() ?? 'jpg';
  const mime = source.type ?? `image/${ext}`;

  if (Platform.OS === 'web') {
    const res = await fetch(source.uri);
    const blob = await res.blob();
    formData.append(field, new File([blob], filename, { type: mime }));
  } else {
    formData.append(field, {
      uri: source.uri,
      name: filename,
      type: mime,
    } as any);
  }
}
