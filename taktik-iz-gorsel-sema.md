# Taktik İz — Görsel Şema

Bu dosya analiz videolarındaki bütün görsellerin kurallarını tanımlar. Her video, her bölüm ve her Remotion bileşeni bu kurallara uyar. Analiz içeriği ayrı dosyadadır. Bu dosya sadece **nasıl görüneceğini** anlatır.

---

## 1. Genel ilkeler

- Gerçek maç görüntüsü veya ekran görüntüsü kullanılmaz. Her pozisyon saha animasyonu olarak yeniden çizilir.
- Kanal rengi yeşildir. Yeşil vurgu rengidir, takım rengi olarak kullanılmaz.
- Her karede aynı düzen kullanılır: solda (veya ortada) saha, sağda bilgi paneli, altta karaoke altyazı.
- Bir karede en fazla bir ana fikir anlatılır.
- Hücum yönü her zaman **soldan sağa**dır. Analiz edilen takım sağa doğru hücum eder.

---

## 2. Renk paleti

### Kanal ve arayüz
| Kullanım | Renk |
|---|---|
| Arka plan (kare) | `#071510` |
| Panel arka planı | `#0f2a1c` |
| Panel kenarı | `#1f5a38` |
| Vurgu yeşili (başlık, rakam, çizgi) | `#39f08a` |
| Ana metin | `#e4fbe9` |
| İkincil metin | `#b9dcc6` |

### Saha
| Kullanım | Renk |
|---|---|
| Saha zemini | `#155f34` |
| Çim şeridi A | `#17703c` |
| Çim şeridi B | `#1c7a43` |
| Saha çizgileri | `#ffffff`, opaklık 0.9, kalınlık 1.6 |
| Temas haritasında saha karartması | `#04140b`, opaklık 0.25 |

### Aksiyon işaretleri
| Aksiyon | Renk | Şekil |
|---|---|---|
| Başarılı pas | `#4fc3ff` dolu, beyaz ince kenar | Daire |
| Başarısız pas | `#4fc3ff` kenar, içi boş | Daire |
| Orta | `#ffd60a` (başarısızsa içi boş) | 45° döndürülmüş kare (elmas) |
| Top sürme | `#ffffff` | Kesik çizgi + ok ucu |
| Top kazanma / müdahale | `#39f08a` | Köşesi hafif yuvarlak kare |
| Şut | `#ff4d3d`, beyaz kenar, etrafında %25 opak hale | Daire, büyüklük = xG |
| Boş alan / pres bölgesi | `#ffd60a`, opaklık 0.10–0.20 | Yarı saydam alan |
| Pres hattı | `#ffd60a` | Kesik dikey çizgi |

### Isı haritası renk geçişi
Yoğunluk 0 → 1:

| Yoğunluk | Renk (RGBA) |
|---|---|
| 0.00 | şeffaf |
| 0.18 | `0,200,110,150` |
| 0.45 | `57,240,138,210` |
| 0.70 | `255,214,10,235` |
| 0.88 | `255,120,40,245` |
| 1.00 | `255,60,50,255` |

Isı haritası sahanın üstüne `screen` karışım modu ile konur.

---

## 3. Saha

- Oran: 600 × 390 birim (iç saha 584 × 374, kenar boşluğu 8).
- Hafif eğik perspektif: `rotateX(16–18°)`, alt kenar sabit (`transform-origin: 50% 100%`).
- 10 dikey çim şeridi, iki ton arasında sırayla.
- Çizilecekler: dış çizgi, orta çizgi, orta yuvarlak ve nokta, iki ceza sahası, iki kale alanı, ceza sahası yayları.
- Sahanın çevresinde ince yeşil çerçeve (`#1d6b3f`, 2px), köşeler 6px yuvarlak.

### Koordinat dönüşümü (SofaScore → ekran)
SofaScore koordinatları 0–100 arasıdır.

```
ekranX = 8 + x * 5.84
ekranY = 8 + (100 - y) * 3.74
```

- `x`: 0 = kendi kalemiz, 100 = rakip kale.
- `y`: 0 = sağ taç çizgisi. Dönüşümden sonra sağ kanat ekranın altında görünür.
- Şut haritası verisinde `x` kaleye uzaklıktır. Önce `x = 100 - x` yapılır, sonra yukarıdaki formül uygulanır.

---

## 4. Oyuncular

- Daire, yarıçap 11.5. Oyuncunun altında hafif gölge (siyah elips, opaklık 0.35, 2px sağa ve 12px aşağıya kaydırılmış).
- **İç renk:** formanın ana rengi. **Dış halka (2.5px):** formanın ikinci rengi. **Numara:** okunaklı kontrast renk, 11px, kalın.
- Renkler her maç için takımların forma renklerinden gelir. İki takımın renkleri birbirine çok benziyorsa deplasman takımının ikinci forması kullanılır.
- Anlatılan takım tam opak görünür. Rakip, pres ve pozisyon karelerinde opaklık 0.55 ile soluk gösterilir.
- Kilit oyuncunun etrafına beyaz halka çizilir (yarıçap 19, 1.5px).

### Örnek forma renkleri
| Takım | İç | Halka | Numara |
|---|---|---|---|
| Trabzonspor | `#8c1538` | `#4fc3ff` | `#ffffff` |

---

## 5. Top ve hareket çizgileri

| Hareket | Çizim |
|---|---|
| Yerden pas | Düz beyaz çizgi, 2px, ok ucu |
| Havadan pas | Kavisli kesik çizgi (6–5), ok ucu |
| Top sürme | Kesik çizgi (4–3), 1.8px, ok ucu |
| Şut | Kalın yeşil ok (`#39f08a`, 4px, yuvarlak uç) |
| Oyuncu koşusu | Kesik ince çizgi, ok ucu |
| Pozisyon adımları | Koyu daire içinde yeşil numara (1, 2, 3…), yeşil kenar |

Topun nasıl gittiği her zaman açıkça gösterilir: havadan, sekerek, direkten dönerek.

---

## 6. Bilgi paneli

- Konum: sahanın sağı, genişliği sahanın yaklaşık yarısı.
- Arka plan `#0f2a1c`, solda 3px yeşil çizgi, köşeler düz.
- Sıralama:
  1. Bölüm etiketi (11px, yeşil, büyük harf, örnek: `BÖLÜM 6 · KİLİT POZİSYON`)
  2. Başlık (16px, kalın)
  3. Gerekirse takım renk açıklaması
  4. 2–4 istatistik: ad solda, değer sağda, altında yeşil çubuk
  5. En altta `TAKTİK İZ` yazısı (11px)

### İstatistik kutuları (oyuncu karelerinde)
Panel yerine sahanın altında yan yana kutular: üstte 3px yeşil çizgi, büyük rakam (20px, yeşil), altında küçük açıklama.

---

## 7. Karaoke altyazı

- Karenin altında, ortalı, 15px.
- Söylenen kelime anında yeşile (`#39f08a`) döner, diğer kelimeler `#e4fbe9`.
- Bir satır, en fazla 8–10 kelime.

---

## 8. Kare tipleri

| Kare | İçerik |
|---|---|
| Diziliş | İki takım kendi yarı sahasında, diziliş adı panelde (ör. `4-2-3-1 vs 3-5-2`) |
| Momentum | Panelde dakika bazlı baskı dalgası, goller ve kartlar işaretli |
| Pas ağı | Oyuncu konumları + aralarında çizgiler, kalınlık = pas sayısı |
| Pres | Pres hattı + top kazanılan noktalar + sarı pres bölgesi |
| Kilit pozisyon | Numaralı adımlar, pas ve şut çizgileri, boş alan vurgusu, panelde xG |
| Isı haritası | Tek oyuncu, iki oyuncu yan yana veya takımın toplamı |
| Temas haritası | Pas, orta, top sürme, top kazanma, şut işaretleri |
| Şut haritası | Şutlar, büyüklük = xG, üstünde xG değeri |

### Oyuncu karesi düzeni (örnek: Salah – Freiburg)
- Üstte oyuncu dairesi, isim, maç bilgisi, sağda `TAKTİK İZ`.
- Ortada iki saha yan yana: solda **ısı haritası**, sağda **topla buluşma noktaları**.
- Altında işaret açıklaması ve sağda "Hücum yönü →".
- Altında 4 istatistik kutusu: isabetli pas, isabetli orta, kilit pas, en büyük fırsat (xG).
- En altta karaoke altyazı.

---

## 9. Isı haritası üretimi

1. Oyuncunun ısı haritası noktaları alınır.
2. Saha 120 × 78 ızgaraya bölünür. Her nokta çevresindeki hücrelere Gauss değeri ekler (yarıçap 9 hücre, `exp(-d²/12)`).
3. Değerler en büyük değere bölünüp 0–1 aralığına getirilir ve `^0.7` uygulanır.
4. 0.05'in altı şeffaf, gerisi bölüm 2'deki geçişle renklendirilir.
5. Yumuşatılarak saha boyutuna büyütülür ve şeffaf PNG olarak kaydedilir.
6. Remotion PNG'yi sahanın üstüne koyar ve soluktan belirgine doğru açar.

---

## 10. Veri kaynakları (SofaScore)

| Veri | Adres |
|---|---|
| Kadrolar ve oyuncu kimlikleri | `/api/v1/event/{maçId}/lineups` |
| Isı haritası | `/api/v1/event/{maçId}/player/{oyuncuId}/heatmap` |
| Pas, orta, top sürme, savunma aksiyonları | `/api/v1/event/{maçId}/player/{oyuncuId}/rating-breakdown` |
| Şutlar ve xG | `/api/v1/event/{maçId}/shotmap/player/{oyuncuId}` |
| Maç istatistikleri | `/api/v1/event/{maçId}/statistics` |
| Olaylar (gol, kart, değişiklik) | `/api/v1/event/{maçId}/incidents` |

Adreslerin başına `https://www.sofascore.com` gelir. Veri, kullanıcının bilgisayarında çalışan betikle çekilir ve yerel veritabanına kaydedilir.

---

## 11. Animasyon kuralları

- Saha sahneye kayarak girer (0.5 sn).
- Oyuncular dizilişe yumuşak hareketle yerleşir.
- Pozisyon adımları numara sırasıyla açılır. Her adım anlatımla eş zamanlıdır.
- Isı haritası 1 saniyede soluktan belirgine açılır.
- İşaretler (pas, orta, şut) türüne göre gruplar halinde belirir: önce paslar, sonra ortalar, en son şutlar.
- Geçişlerde sert kesme yok, kısa kayma veya solma kullanılır.
