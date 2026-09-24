/*
 * YAZI EKLEME REHBERİ
 * 1. Bu listedeki örnek nesnelerden birini kopyalayın.
 * 2. id benzersiz, tarih YYYY-AA-GG biçiminde olsun.
 * 3. category alanına "dev" yazılırsa Dev Log'da görünür.
 * 4. content içindeki her paragrafı çift satır sonu ile ayırın.
 * 5. Yeni yazılar en üstte görünmesi için tarihleri doğru girin.
 */
window.POSTS = [
  {
    id: 'deneme-postu',
    date: '2026-09-22T15:03:00+03:00',
    title: 'deneme postu',
    excerpt: 'Kısa düşünceler için burada küçük bir alan var.',
    category: 'note',
    content: `Burası sitenin ilk notu. Yazıları GitHub üzerinde doğrudan bu dosyadan düzenleyebilirsin.

Her yazı bağımsız bir kayıt olarak tutulur; sayfa yenilendiğinde otomatik olarak zaman sırasına girer.

## Küçük bir başlangıç

Metin, bağlantı ve basit kod parçaları kullanılabilir. Örneğin: \`git commit -m "yeni yazı"\`.`
  },
  {
    id: 'hello-world',
    date: '2026-09-21T23:15:00+03:00',
    title: 'Hello, World!',
    excerpt: 'İlk satır, ilk commit, açık bir sayfa.',
    category: 'dev',
    content: `Bir şeyleri yayınlamak için büyük bir başlangıca gerek yok. Bu sayfa, küçük notların zamanla birikmesi için var.

İlk kayıt burada dursun.`
  }
];
