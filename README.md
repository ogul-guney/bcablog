# GitHub Pages kişisel blog

Bu proje derleme, sunucu, veritabanı veya üçüncü taraf kaynak gerektirmez. GitHub Pages ayarından `Deploy from a branch` seçerek ana dalın kök klasörünü yayınlamak yeterlidir.

## İçerik düzenleme

- Site adı ve alt bilgi: `content/site.js`
- Yazılar: `content/posts.js`
- Görünüm: `assets/styles.css`
- Davranışlar: `assets/app.js`

Yeni yazı eklemek için `content/posts.js` içindeki bir yazı nesnesini kopyalayın. `id` eşsiz olmalı; `date` alanı ISO biçiminde (`2026-09-24T19:30:00+03:00`) yazılmalıdır. `category: 'dev'` olanlar Dev Log sayfasında görünür.

## GitHub Pages yayını

1. Dosyaları yeni bir GitHub deposunun ana dizinine yükleyin.
2. Depoda **Settings → Pages** ekranını açın.
3. **Deploy from a branch** seçin; dal olarak `main`, klasör olarak `/(root)` ayarlayın.
4. **Save** ile yayınlayın. GitHub birkaç dakika içinde site adresini Pages ekranında gösterir.

## Başka bir yapay zekâ ile düzenleme

Kodu verirken şu dosyaların rollerini belirtin: `content/posts.js` yalnızca içerik; `content/site.js` genel metinler; `assets/styles.css` tasarım; `assets/app.js` işlevler. Bu ayrım, tasarım ve içerik değişikliklerinin birbirine karışmasını engeller.
