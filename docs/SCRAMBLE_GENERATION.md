# Receipt Capture & Client-Side Image Pipeline

## Overview

The mobile app handles receipt image capture via camera or gallery, then sends the image to the server for OCR processing.

## Capture Flow

```
User taps "Capture Receipt"
       ↓
Choose source: Camera / Gallery
       ↓
expo-image-picker opens native UI
       ↓
Image selected → Preview screen
       ↓
User confirms → Upload to API
       ↓
Loading indicator → Server processes OCR
       ↓
Extracted data shown → User reviews & edits
       ↓
Expense auto-filled from receipt data
```

## Implementation

### Camera/Gallery Integration

```typescript
import * as ImagePicker from "expo-image-picker";

async function pickImage(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.8,
  });
  return result.assets?.[0]?.uri ?? null;
}

async function takePhoto(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
  });
  return result.assets?.[0]?.uri ?? null;
}
```

### Upload to API

```typescript
async function uploadReceipt(uri: string): Promise<ReceiptUploadResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "receipt.jpg",
  } as any);

  const response = await api.post("/receipts/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progress) => {
      // Update progress bar
    },
  });

  return response.data.data;
}
```

## UI States

| State | Component | Action |
|-------|-----------|--------|
| Idle | "Capture Receipt" button | Opens source picker |
| Pick source | Action sheet (Camera / Gallery) | Launches native picker |
| Preview | Image preview + Confirm/Retake buttons | Upload or retake |
| Uploading | Progress bar | Cancel upload |
| Processing | Skeleton loader | Poll for result |
| Complete | Extracted data form | Edit or create expense |
| Error | Error message + Retry button | Retry upload |

## Screen Components

```
ReceiptCaptureScreen
├── ReceiptSourcePicker (camera / gallery choice)
├── ReceiptPreview (image + confirm/retake)
├── UploadProgress (progress bar)
├── ProcessingOverlay (loading state)
└── ExtractedDataForm (editable amount, date, merchant)
```

## Dependencies

- `expo-image-picker` — camera and gallery access
- `expo-camera` — (alternative) custom camera UI
- `axios` — multipart upload with progress tracking
- `expo-file-system` — temp file management

## Security
- Images stored temporarily in app cache
- EXIF data can be stripped before upload
- No local persistence of receipt images after upload
- Secure upload over HTTPS
