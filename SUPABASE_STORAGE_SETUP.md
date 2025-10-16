# Supabase Storage Kurulum Talimatları

Foto yükleme özelliğinin çalışması için Supabase Dashboard'da bir Storage bucket oluşturmanız gerekiyor.

## Adımlar:

1. **Supabase Dashboard'a gidin**
   - https://supabase.com/dashboard
   - Projenizi seçin

2. **Storage'a gidin**
   - Sol menüden "Storage" sekmesine tıklayın

3. **Yeni Bucket Oluşturun**
   - "Create a new bucket" butonuna tıklayın
   - Bucket Name: `hotel-images`
   - Public bucket: **✅ AÇIK** (Public olmalı)
   - "Create bucket" butonuna tıklayın

4. **Bucket Ayarlarını Kontrol Edin**
   - `hotel-images` bucket'ına tıklayın
   - Sağ üstteki "Settings" ikonuna tıklayın
   - "Public bucket" seçeneğinin **AÇIK** olduğundan emin olun

## Tamamlandı!

Artık admin panelinden otel eklerken:
- ✅ Kapak fotoğrafı yükleyebilirsiniz (1 adet)
- ✅ Galeri fotoğrafları yükleyebilirsiniz (10 adete kadar)
- ✅ Progress bar ile yükleme durumunu görebilirsiniz
- ✅ Fotoğrafları silebilir ve yeni ekleyebilirsiniz
- ✅ Fotoğraflar otomatik olarak veritabanına kaydedilir
- ✅ Ön yüzde (ana sayfa ve detay sayfada) fotoğraflar görüntülenir

## Özellikler:

### Kapak Fotoğrafı:
- Ana sayfadaki otel kartlarında gösterilir
- Tek bir fotoğraf seçimi
- Preview ile önizleme
- Sürükle-bırak veya tıklayarak seç

### Galeri Fotoğrafları:
- Otel detay sayfasında galeri olarak gösterilir
- Maksimum 10 fotoğraf
- Çoklu seçim (multiple)
- Her fotoğraf için silme butonu
- Sıralama numarası

### Validasyon:
- ✅ Desteklenen formatlar: JPG, PNG, WebP
- ✅ Maksimum dosya boyutu: 5MB
- ✅ Otomatik hata mesajları

### Güvenlik:
- ✅ Dosya tipi kontrolü
- ✅ Dosya boyutu kontrolü
- ✅ Supabase Storage güvenlik kuralları
