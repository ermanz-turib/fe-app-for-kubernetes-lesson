# Demo Frontend

Backend'inize istek atan ve isteğin **gidip gitmediğini, ne cevap aldığını** gösteren basit bir sayfa.

## 1. Kurun ve çalıştırın

Gerekenler: [Node.js](https://nodejs.org) 20.19+ ya da 22.12+.

```bash
npm install
npm start
```

Tarayıcıda http://localhost:3000 adresini açın.

## 2. Backend'inize bağlayın

- **Hızlıca:** backend'inizin adresini (ör. `http://localhost:8080/api/hello`) sayfadaki adres kutusuna yazıp
  **Gönder**'e basın.
- **Kalıcı olarak:** `src/config.ts` dosyasında `API_URL`'i backend'inizin adresi yapın ve endpoint'lerinizi
  `QUICK_REQUESTS` listesine ekleyin; sayfada düğme olarak çıkarlar. Değiştirmeniz gereken tek dosya bu.

Sayfa, sonucu renk ve açıklamayla gösterir: başarılı mı, backend hata mı döndü, hiç ulaşılamadı mı.

## 3. Backend'de CORS izni verin

Sayfa `http://localhost:3000`'den açıldığı için tarayıcı, backend'in cevabını ancak backend bu adrese izin verirse
gösterir. İzin yoksa sayfa "Backend'e ulaşılamadı" der ve tarayıcı konsolunda (F12) `CORS` hatası görünür. Spring
Boot için:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("http://localhost:3000").allowedMethods("*");
    }
}
```

## Backend'iniz henüz hazır değilse

Ayrı bir terminalde `npm run mock-backend` çalıştırın. `http://localhost:8080`'de, her isteğe gelen isteğin kopyasıyla
cevap veren sahte bir backend açılır.
