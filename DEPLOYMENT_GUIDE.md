# 🚀 راهنمای جامع و گام‌به‌گام انتشار FitLife Bulgaria

---

## 🌐 روش ۱: انتشار آنلاین در وب (Vercel / Netlify - ۱۰۰٪ رایگان و ۳۰ ثانیه‌ای)

این سریع‌ترین روش برای قرار دادن برنامه روی یک دامین زنده با HTTPS رایگان است:

### گزینه الف: انتشار در Vercel
1. وارد سایت [vercel.com](https://vercel.com) شوید.
2. فولدر پروژه را در گیت‌هاب (GitHub) آپلود کرده و در Vercel گزینه **Import Repository** را بزنید.
3. در قسمت Framework Preset گزینه **Other** را بگذارید و دکمه **Deploy** را بزنید.
4. در عرض ۲۰ ثانیه لینک اختصاصی با دامنه رسمی (مانند `fitlife-bulgaria.vercel.app`) تحویل داده می‌شود!

### گزینه ب: انتشار در Netlify
1. وارد [netlify.com](https://netlify.com) شوید.
2. کل فولدر پروژه را بگیرید و داخل پنجره **Drag & Drop** رها کنید! برنامه فوراً آنلاین می‌شود.

---

## 📱 روش ۲: ساخت پکیج نیتیو آیفون (iOS App Store & Xcode)

برای خروجی گرفتن فایل نیتیو آیفون (IPA) و ارسال به App Store:

### مراحل اجرا در ترمینال:
```bash
# ۱. نصب پکیج‌های Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios

# ۲. اضافه کردن پلتفرم iOS
npx cap add ios

# ۳. همگام‌سازی فایل‌های برنامه با پروژه Xcode
npx cap sync ios

# ۴. باز کردن پروژه در نرم‌افزار Xcode روی مک
npx cap open ios
```

### تنظیمات دسترسی‌های iOS در فایل `Info.plist`:
کدهای زیر را داخل فایل `ios/App/App/Info.plist` قرار دهید تا اپلیکیشن مجوزهای لازم را از کاربر بگیرد:

```xml
<!-- دسترسی به دوربین برای اسکنر هوشمند غذا -->
<key>NSCameraUsageDescription</key>
<string>FitLife uses your camera to scan meals and analyze nutrition calories with AI.</string>

<!-- دسترسی به گالری برای انتشار عکس تمرین -->
<key>NSPhotoLibraryUsageDescription</key>
<string>FitLife requires photo library access to upload workout photos and stories.</string>

<!-- دسترسی به GPS برای ردیاب زنده دویدن -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>FitLife uses GPS location to track your running distance, pace, and live route in Sofia parks.</string>
```

---

## 📲 روش ۳: نصب آنی روی آیفون بدون نیاز به اپ استور (PWA)

کاربران می‌توانند برنامه را مستقیماً از داخل مرورگر Safari روی صفحه اصلی آیفون نصب کنند:
1. لینک برنامه را در **Safari** آیفون باز کنید.
2. دکمه **Share** (آیکون مربع با فلش رو به بالا در پایین صفحه) را لمس کنید.
3. گزینه **Add to Home Screen (Добави към началния екран)** را انتخاب کنید.
4. آیکون شیک FitLife Bulgaria روی صفحه اصلی آیفون با ظاهر کاملاً نیتیو و بدون نوار آدرس مرورگر ظاهر می‌شود!

---

## 📝 اطلاعات آماده برای ثبت در App Store Connect:

- **App Name:** FitLife Bulgaria
- **Subtitle:** AI Workout, GPS Run & Nutrition
- **Primary Category:** Health & Fitness
- **Secondary Category:** Sports
- **Age Rating:** 4+
- **Price:** Free (with FitLife PRO Subscriptions at 9.90 BGN/mo)
- **Description:**
  > FitLife Bulgaria is the premier AI-powered fitness, running, and nutrition super-app tailored for Bulgaria. Track your workouts, generate custom AI routines, scan meals with computer vision, track live GPS runs across Sofia parks, and connect with a thriving athlete community.
