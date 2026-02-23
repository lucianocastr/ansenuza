# Miramar de Ansenuza — Documentación Completa del Proyecto

> **MVP React Native + Expo** · JavaScript · React Navigation v6
> Última actualización: Feb 2026 · Estado: MVP completo con fidelidad total al mock · Listo para demo con cliente

---

## Tabla de contenidos

1. [Descripción del proyecto](#1-descripción-del-proyecto)
2. [Flujos de usuario](#2-flujos-de-usuario)
3. [Arquitectura y decisiones técnicas](#3-arquitectura-y-decisiones-técnicas)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [Modelo de datos (mock)](#5-modelo-de-datos-mock)
6. [Sistema de diseño](#6-sistema-de-diseño)
7. [Pantallas y componentes](#7-pantallas-y-componentes)
8. [Configuración del entorno](#8-configuración-del-entorno)
9. [Instalación desde cero](#9-instalación-desde-cero)
10. [Ejecución en desarrollo](#10-ejecución-en-desarrollo)
11. [Ejecución en dispositivo físico](#11-ejecución-en-dispositivo-físico)
12. [Ejecución en emuladores](#12-ejecución-en-emuladores)
13. [Build y despliegue (EAS)](#13-build-y-despliegue-eas)
14. [Solución de problemas frecuentes](#14-solución-de-problemas-frecuentes)
15. [Próximas iteraciones (roadmap)](#15-próximas-iteraciones-roadmap)
16. [Registro de decisiones](#16-registro-de-decisiones)

---

## 1. Descripción del proyecto

**Miramar de Ansenuza** es una plataforma de turismo para el Mar de Ansenuza (Córdoba, Argentina), el quinto lago salino más grande del mundo. Este MVP fue construido a partir de mockups en Stitch (Google) y cubre dos tipos de usuarios:

| Rol | Descripción |
|-----|-------------|
| **Turista** | Explora, filtra y consulta ofertas turísticas |
| **Proveedor** | Publica y gestiona sus servicios, ve métricas de rendimiento |

**Objetivo del MVP:** Demo funcional con cliente. Sin backend real. Todos los datos son simulados.

**Credenciales de demo (proveedor):**
```
Email:    proveedor@ansenuza.com
Password: 123456
```

---

## 2. Flujos de usuario

### Flujo Turista
```
Bienvenida
  └─ [Continuar]
       └─ TouristTabs
            ├─ Tab "Explorar" → ListadoOfertas
            │    ├─ Búsqueda por texto (título / ubicación)
            │    ├─ Filtro por categoría (Todos / Hospedaje / Negocio / Servicio)
            │    └─ [Ver Detalles] → DetalleOferta
            │         ├─ Galería de imágenes (dots decorativos)
            │         ├─ Precio con/sin descuento
            │         ├─ Descripción + Contacto
            │         ├─ Reseñas y formulario de comentario
            │         └─ CTA "Buscar disponibilidad" (Alert con teléfono)
            ├─ Tab "Reservas" → Placeholder
            ├─ FAB central → Alert "Accedé como Proveedor"
            ├─ Tab "Favoritos" → Placeholder
            └─ Tab "Perfil" → PerfilScreen
                  └─ [Acceder como Proveedor] → LoginProveedor
```

### Flujo Proveedor
```
LoginProveedorScreen
  └─ [Iniciar Sesión] (valida contra MOCK_USER en mockData.js)
       └─ navigation.reset → ProviderArea
            ├─ Tab "Inicio" → MisPublicaciones  ← tab 1 (igual que Publicaciones, fiel al mock)
            ├─ Tab "Publicaciones" → MisPublicaciones
            │    ├─ Cards de resumen (Activas / Pendientes / Pausadas)
            │    ├─ Lista de publicaciones con estado
            │    └─ FAB "Crear Nueva Publicación" → NuevaPublicacion
            │         ├─ Selección de categoría
            │         ├─ Título, descripción, precio, frecuencia
            │         ├─ Selector de fechas (decorativo)
            │         ├─ Picker de ubicación en mapa (decorativo)
            │         └─ [Publicar] → Alert + goBack
            ├─ Tab "Estadísticas" → EstadisticasScreen
            │    ├─ Selector de período (Últimos 30 días / Este mes / Año)
            │    ├─ 3 cards: Visualizaciones, Reservas, Ingresos
            │    ├─ BarChart custom (Vistas vs Reservas por día)
            │    └─ Top 3 publicaciones más populares
            ├─ Tab "Mensajes" → Placeholder
            └─ Tab "Perfil" → PerfilProveedorScreen
                  └─ [Cerrar sesión] → Alert → navigation.navigate('Bienvenida')
```

---

## 3. Arquitectura y decisiones técnicas

### Mapa de navegación completo

```
NavigationContainer
└─ AppNavigator (Stack, headerShown: false)
    ├─ "Bienvenida"          → BienvenidaScreen
    ├─ "TouristArea"         → TouristTabs (Bottom Tab)
    │   ├─ "Explorar"        → ExplorarStack (Stack interno)
    │   │   ├─ "ListadoOfertas"  → ListadoOfertasScreen
    │   │   └─ "DetalleOferta"   → DetalleOfertaScreen
    │   ├─ "Reservas"        → PlaceholderScreen
    │   ├─ "Agregar"         → tabBarButton override → FABButton (Alert)
    │   ├─ "Favoritos"       → PlaceholderScreen
    │   └─ "Perfil"          → PerfilScreen
    ├─ "LoginProveedor"      → LoginProveedorScreen
    └─ "ProviderArea"        → ProviderAreaStack (Stack interno)
        ├─ "ProviderTabs"    → ProviderTabs (Bottom Tab)
        │   ├─ "Inicio"           → MisPublicacionesScreen  ← tab 1, todos los mocks proveedor
        │   ├─ "Publicaciones"    → MisPublicacionesScreen  ← tab 2, mock administración
        │   ├─ "Estadísticas"     → EstadisticasScreen
        │   ├─ "Mensajes"         → PlaceholderScreen
        │   └─ "PerfilProveedor"  → PerfilProveedorScreen
        └─ "NuevaPublicacion" → NuevaPublicacionScreen
```

### Por qué esta arquitectura

| Decisión | Alternativa descartada | Razón |
|----------|----------------------|-------|
| Stack raíz con dos ramas (Tourist/Provider) | Una sola rama con guards de auth | Más simple para MVP sin AuthContext; el reset de navegación maneja la sesión |
| ExplorarStack dentro de TouristTabs | DetalleOferta como modal | Las tabs se ocultan al entrar al Detalle, que es el comportamiento mobile correcto |
| NuevaPublicacion como screen del ProviderAreaStack | Como tab | Permite hacer push/pop limpio desde el FAB de MisPublicaciones |
| `navigation.navigate('LoginProveedor')` desde PerfilScreen anidado | Pasar callbacks | React Nav v6 hace bubble automático hacia el Stack padre que contiene la ruta |
| `navigation.reset()` al hacer login | `navigation.navigate()` | Evita que el botón Atrás regrese al LoginProveedor después de autenticarse |
| `useState` local sin Context | Redux / Zustand | MVP no necesita estado compartido entre pantallas ajenas |
| Imágenes de picsum.photos | URLs de Google CDN del mock | Las CDN de Google son authenticated y fallan en mobile; picsum siempre disponible |

### Dependencias y sus roles

```json
{
  "expo": "~52.0.18",                          // Runtime y toolchain
  "@react-navigation/native": "^6.1.18",       // Core de navegación
  "@react-navigation/stack": "^6.4.1",         // Navigator tipo Stack
  "@react-navigation/bottom-tabs": "^6.6.1",   // Navigator tipo Bottom Tabs
  "react-native-screens": "~4.1.0",            // Optimización de screens nativas
  "react-native-safe-area-context": "4.12.0",  // Manejo de notch / home indicator
  "react-native-gesture-handler": "~2.20.2",   // Requerido por Stack Navigator
  "@expo/vector-icons": "^14.0.4",             // MaterialIcons (incluido en Expo)
  "expo-status-bar": "~2.0.0"                  // Control de la barra de estado
}
```

**Ninguna librería de UI externa** (no NativeBase, no Tamagui, no RN Paper). Todo StyleSheet nativo para máximo control y menor tamaño de bundle.

---

## 4. Estructura de carpetas

```
AnsenuZaApp/
│
├── App.js                          # Entry point: SafeAreaProvider + StatusBar + AppNavigator
├── app.json                        # Nombre, slug, íconos, orientación (portrait), splash
├── package.json                    # Dependencias exactas
├── babel.config.js                 # Preset: babel-preset-expo
│
└── src/
    │
    ├── theme/
    │   └── colors.js               # Única fuente de verdad de la paleta de colores
    │                               # Importar en TODA pantalla/componente con colores
    │
    ├── data/
    │   └── mockData.js             # Exporta: offers[], providerListings[], providerStats, MOCK_USER
    │                               # Toda modificación de datos de demo va aquí
    │
    ├── navigation/
    │   ├── AppNavigator.js         # Stack raíz + ProviderAreaStack (stack interno)
    │   ├── TouristTabs.js          # Bottom Tabs turista + ExplorarStack + FABButton
    │   └── ProviderTabs.js         # Bottom Tabs proveedor (4 tabs)
    │
    ├── screens/
    │   ├── BienvenidaScreen.js         # Splash turista. Navega a TouristArea.
    │   ├── ListadoOfertasScreen.js     # FlatList filtrable. Navega a DetalleOferta.
    │   ├── DetalleOfertaScreen.js      # Recibe `route.params.offer`. CTA + reseñas.
    │   ├── LoginProveedorScreen.js     # Form login. reset() a ProviderArea si credenciales OK.
    │   ├── MisPublicacionesScreen.js   # Stats + FlatList de ListingItem + FAB.
    │   ├── NuevaPublicacionScreen.js   # Formulario completo de creación.
    │   ├── EstadisticasScreen.js       # Métricas + BarChart + top publicaciones.
    │   ├── PerfilScreen.js             # Perfil turista + acceso a LoginProveedor.
    │   ├── PerfilProveedorScreen.js    # Perfil proveedor + logout.
    │   └── PlaceholderScreen.js        # Pantalla genérica "Próximamente".
    │
    └── components/
        ├── OfertaCard.js           # Card con imagen, categoría, favorito, precio, CTA.
        │                           # Props: offer (objeto), onPress (función)
        │                           # Estado interno: isFavorite (useState)
        ├── StatCard.js             # Card de métrica con tendencia.
        │                           # Props: label, value, icon, trend, trendUp
        ├── ListingItem.js          # Item de publicación con estado (active/pending/paused).
        │                           # Props: item (objeto), onStats (función)
        └── BarChart.js             # Gráfico de barras 100% con View nativas.
                                    # Props: data (array {day, views, bookings})
```

---

## 5. Modelo de datos (mock)

### `offers[]` — Listado de ofertas turísticas

```js
{
  id: string,           // Identificador único
  title: string,        // Nombre de la oferta
  category: string,     // 'Hospedaje' | 'Negocio' | 'Servicio'
  location: string,     // Ciudad, Provincia
  rating: number,       // 4.0 - 5.0
  reviewCount: number,  // Cantidad de reseñas
  price: number,        // Número sin signo
  priceSuffix: string,  // '/noche' | '/persona'
  priceLabel: string,   // 'Desde' | 'Precio Fijo'
  image: string,        // URL de picsum.photos
  isFavorite: boolean,  // Estado inicial del corazón
  badge: string | null, // 'Más Popular' o null
  discount: {           // null si no hay descuento
    percent: number,
    originalPrice: number,
    validUntil: string
  } | null,
  description: string,  // Texto largo para DetalleOferta
  phone: string,        // Teléfono de contacto
  reviews: [            // Array de reseñas
    {
      id: string,
      name: string,
      rating: number,   // 1-5
      comment: string,
      time: string,     // 'Hace 2 días'
      avatar: string    // URL de picsum.photos
    }
  ]
}
```

### `providerListings[]` — Publicaciones del proveedor

```js
{
  id: string,
  title: string,
  location: string,
  price: number,
  status: 'active' | 'pending' | 'paused',
  image: string
}
```

### `providerStats` — Métricas del panel

```js
{
  totalViews: number,
  viewsTrend: string,       // '+12%'
  viewsTrendUp: boolean,
  confirmedBookings: number,
  bookingsTrend: string,
  bookingsTrendUp: boolean,
  revenue: number,
  revenueTrend: string,
  revenueTrendUp: boolean,
  weeklyData: [
    { day: string, views: number, bookings: number }  // 7 items (Lun-Dom)
  ],
  topPublications: [
    { id, title, views, bookings, revenue, image }
  ]
}
```

### `MOCK_USER` — Credenciales del proveedor demo

```js
{
  name: 'Luciano Proveedor',
  email: 'proveedor@ansenuza.com',
  password: '123456',
  avatar: string,
  company: 'Turismo Ansenuza'
}
```

---

## 6. Sistema de diseño

### Paleta de colores (`src/theme/colors.js`)

| Token | Valor | Uso |
|-------|-------|-----|
| `primary` | `#9e4fde` | Botones principales, íconos activos, badges |
| `primaryLight` | `rgba(158,79,222,0.1)` | Fondos de chips, secciones destacadas |
| `primaryMedium` | `rgba(158,79,222,0.2)` | Hover states, bordes suaves |
| `background` | `#f7f6f8` | Fondo global de pantallas |
| `white` | `#ffffff` | Cards, inputs, tab bar |
| `text` | `#0f172a` | Textos principales |
| `textSecondary` | `#64748b` | Subtítulos, descripciones |
| `textMuted` | `#94a3b8` | Placeholders, timestamps |
| `border` | `#e2e8f0` | Bordes de cards e inputs |
| `borderPrimary` | `rgba(158,79,222,0.15)` | Bordes de cards con acento |
| `success` | `#10b981` | Badge "Activo" |
| `warning` | `#f59e0b` | Badge "Pendiente", estrellas |
| `error` | `#ef4444` | Textos de error, botón logout |
| `trendUp` | `#16a34a` | Tendencia positiva en estadísticas |
| `trendDown` | `#dc2626` | Tendencia negativa en estadísticas |

### Tipografía
- Sin fuente custom instalada. Usa la fuente nativa del sistema (SF Pro en iOS, Roboto en Android).
- Para agregar **Plus Jakarta Sans** (usada en los mockups):
  ```bash
  npx expo install expo-font @expo-google-fonts/plus-jakarta-sans
  ```
  Luego envolver App.js con `useFonts` hook.

### Iconografía
- **MaterialIcons** de `@expo/vector-icons` (bundleado con Expo, sin descarga extra).
- Los íconos del mock usan Material Symbols; se mapean al equivalente más cercano en MaterialIcons.

### Radios de borde
| Elemento | Valor |
|----------|-------|
| Cards, modales | `16px` |
| Inputs, botones | `12px` |
| Chips, badges | `999px` (redondeado completo) |
| Botones de acción primaria | `14px` |

---

## 7. Pantallas y componentes

### Pantallas

| Archivo | Ruta de acceso | Estado/Lógica |
|---------|----------------|---------------|
| `BienvenidaScreen` | Ruta inicial del AppNavigator | Sin estado. Navega a `TouristArea` |
| `ListadoOfertasScreen` | Tab "Explorar" → ExplorarStack | `search: string`, `activeCategory: string`. Filtra con `useMemo` |
| `DetalleOfertaScreen` | Push desde ListadoOfertas | `comment: string`, `isFavorite: boolean`, `descExpanded: boolean`. Recibe `offer` por `route.params` |
| `LoginProveedorScreen` | Stack raíz | `email`, `password`, `showPassword`, `rememberMe`, `loading`. Valida contra `MOCK_USER` |
| `MisPublicacionesScreen` | Tab "Publicaciones" | Sin estado. Lee `providerListings` de mockData |
| `NuevaPublicacionScreen` | Push desde MisPublicaciones | `category`, `title`, `description`, `price`, `frequency`, `address`, `freqOpen` |
| `EstadisticasScreen` | Tab "Estadísticas" | `activePeriod: string`. Lee `providerStats` de mockData |
| `PerfilScreen` | Tab "Perfil" (turista) | Sin estado |
| `PerfilProveedorScreen` | Tab "Perfil" (proveedor) | Sin estado. Logout con Alert |
| `PlaceholderScreen` | Reservas / Favoritos / Mensajes | Sin estado. Muestra nombre del tab |

### Componentes reutilizables

| Componente | Props | Responsabilidad |
|-----------|-------|----------------|
| `OfertaCard` | `offer`, `onPress` | Card visual completa. Maneja favorito localmente |
| `StatCard` | `label`, `value`, `icon`, `trend`, `trendUp` | Métrica con flecha de tendencia |
| `ListingItem` | `item`, `onStats` | Fila de publicación con botones Editar / Estadísticas |
| `BarChart` | `data[]` `{day, views, bookings}` | Gráfico de barras con Views nativas. Sin librería externa |

---

## 8. Configuración del entorno

### Requisitos de software

| Herramienta | Versión mínima | Verificación |
|------------|----------------|-------------|
| Node.js | 18.x LTS | `node --version` |
| npm | 9.x | `npm --version` |
| Git | Cualquiera | `git --version` |
| Expo CLI | Incluido vía npx | `npx expo --version` |

### Para emuladores (opcional)

**Android:**
- Android Studio con SDK 33+
- Un AVD (Android Virtual Device) configurado
- Variable de entorno `ANDROID_HOME` apuntando al SDK

**iOS (solo macOS):**
- Xcode 14+
- Simulador de iOS instalado
- `xcode-select --install` ejecutado

### Versiones exactas del proyecto

```
expo:                 52.0.18
react:                18.3.1
react-native:         0.76.5
@react-navigation/*:  6.x
node (recomendado):   20.x LTS
```

---

## 9. Instalación desde cero

Seguí estos pasos **en orden exacto**:

### Paso 1 — Crear el proyecto base de Expo

```bash
npx create-expo-app AnsenuZaApp --template blank
```

Esto genera la estructura mínima de Expo con `App.js` y `package.json`.

### Paso 2 — Ingresar al directorio

```bash
cd AnsenuZaApp
```

### Paso 3 — Copiar los archivos del proyecto

Copiá **todo el contenido** de esta carpeta (`AnsenuZaApp/`) al directorio recién creado, reemplazando los archivos existentes. Asegurate de copiar también la carpeta `src/` completa.

La estructura final debe verse así:
```
AnsenuZaApp/
├── App.js           ← reemplazado
├── app.json         ← reemplazado
├── package.json     ← reemplazado
├── babel.config.js  ← reemplazado
└── src/             ← carpeta nueva
    ├── theme/
    ├── data/
    ├── navigation/
    ├── screens/
    └── components/
```

### Paso 4 — Instalar dependencias

```bash
npm install
```

Esto descarga todo lo declarado en `package.json`. Puede tomar 1-3 minutos.

### Paso 5 — Crear la carpeta de assets (si no existe)

Expo necesita los archivos de íconos y splash. Si no existen, creá placeholders:
```bash
mkdir assets
```

O bien usá los assets que genera `create-expo-app` (ya están en la carpeta si seguiste el paso 1).

### Paso 6 — Verificar instalación

```bash
npx expo start
```

Deberías ver un QR y el menú de Expo en la terminal sin errores. Si aparece error, ver sección [14. Solución de problemas](#14-solución-de-problemas-frecuentes).

---

## 10. Ejecución en desarrollo

### Iniciar el servidor de Metro (bundler)

```bash
npx expo start
```

Esto abre el **Expo Dev Tools** en la terminal con las siguientes opciones:

```
› Press a │ open Android emulator
› Press i │ open iOS simulator
› Press w │ open web browser
› Press r │ reload app
› Press m │ toggle menu
› Press j │ open debugger
```

### Modos de conexión

| Modo | Comando | Cuándo usarlo |
|------|---------|---------------|
| LAN (default) | `npx expo start` | PC y teléfono en la misma red Wi-Fi |
| Tunnel | `npx expo start --tunnel` | Redes con firewall o diferentes redes |
| Localhost | `npx expo start --localhost` | Solo emuladores locales |

---

## 11. Ejecución en dispositivo físico

### Android y iOS — con Expo Go

1. Instalar **Expo Go** desde la tienda:
   - [Android — Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS — App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Conectar el teléfono a la **misma red Wi-Fi** que tu PC.

3. Ejecutar en la terminal:
   ```bash
   npx expo start
   ```

4. **Android:** Abrir Expo Go → "Scan QR code" → Escanear el QR de la terminal.

5. **iOS:** Abrir la cámara del teléfono → Apuntar al QR → Tocar el banner que aparece.

> **Si el QR no conecta:** Usar modo tunnel: `npx expo start --tunnel`

### Recarga en caliente

Una vez conectado, cualquier cambio guardado en los archivos `.js` se refleja **automáticamente** en el dispositivo (Fast Refresh). No es necesario relanzar la app.

Para forzar una recarga completa, sacudir el dispositivo → "Reload".

---

## 12. Ejecución en emuladores

### Android (Android Studio)

**Pre-requisito:** AVD creado en Android Studio (`Tools → Device Manager → Create Device`).

```bash
# Iniciar emulador y abrir la app automáticamente
npx expo start --android
```

O bien: iniciar el AVD manualmente desde Android Studio, luego ejecutar `npx expo start` y presionar `a`.

### iOS (solo macOS con Xcode)

```bash
# Abrir en simulador de iOS
npx expo start --ios
```

O bien: ejecutar `npx expo start` y presionar `i`.

Para elegir un modelo específico de iPhone:
```bash
npx expo run:ios --simulator "iPhone 15 Pro"
```

---

## 13. Build y despliegue (EAS)

EAS (Expo Application Services) es la forma oficial de construir y publicar apps Expo.

### Instalación de EAS CLI

```bash
npm install -g eas-cli
eas login
```

Crear una cuenta gratuita en [expo.dev](https://expo.dev) si no tenés una.

### Configurar el proyecto

```bash
eas build:configure
```

Esto genera `eas.json` en la raíz del proyecto con los perfiles de build.

### Build de APK para demo (Android)

Un APK puede instalarse directamente en cualquier Android sin Play Store:

```bash
eas build --platform android --profile preview
```

El perfil `preview` en `eas.json` debe tener `buildType: "apk"`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Al finalizar, EAS proporciona un **link de descarga directo** del APK. Compartilo para que cualquier persona con Android lo instale.

### Build de AAB para Google Play Store (Android)

```bash
eas build --platform android --profile production
```

El perfil `production` usa `buildType: "app-bundle"` (AAB) por defecto.

### Build de IPA para iOS (TestFlight / App Store)

Requiere cuenta de Apple Developer ($99/año):

```bash
eas build --platform ios --profile production
```

### Submit a tiendas (opcional)

```bash
# Google Play
eas submit --platform android

# App Store
eas submit --platform ios
```

### Publicar actualización OTA (sin build nuevo)

Si solo cambiaste JS (no código nativo):

```bash
eas update --branch production --message "Fix en pantalla de detalle"
```

Los usuarios con la app instalada reciben la actualización en el próximo lanzamiento.

---

## 14. Solución de problemas frecuentes

### Error: `Unable to resolve module`
```bash
# Limpiar caché de Metro
npx expo start --clear
```

### Error: `react-native-gesture-handler` no inicializado
Verificar que `App.js` importa `'react-native-gesture-handler'` como **primera línea**:
```js
import 'react-native-gesture-handler';  // ← debe ser la primera línea
```

### Error: `NavigationContainer` no encontrado
Verificar que `@react-navigation/native` está instalado:
```bash
npm install @react-navigation/native
```

### Error al instalar en iOS: `pod install` falla
```bash
cd ios && pod install && cd ..
```
Si persiste, actualizar CocoaPods: `sudo gem install cocoapods`

### Las imágenes no cargan en el dispositivo
Las imágenes usan `picsum.photos`. Verificar:
1. El dispositivo tiene conexión a internet.
2. El URL es válido: `https://picsum.photos/seed/hotel1/800/500`

### QR no conecta (error de red)
Usar modo túnel:
```bash
npx expo start --tunnel
```
Requiere `@expo/ngrok` instalado: `npm install @expo/ngrok`

### Metro bundler se cuelga
```bash
# Matar proceso y limpiar caché
npx react-native start --reset-cache
# o
rm -rf node_modules/.cache
npx expo start --clear
```

### Error: `expo` command not found
```bash
npm install -g expo-cli
# o usar siempre con npx:
npx expo start
```

---

## 15. Próximas iteraciones (roadmap)

Estas funcionalidades están **fuera del alcance del MVP** pero son el siguiente paso natural:

### Iteración 2 — Backend y autenticación real
- [ ] Integrar Supabase o Firebase como backend
- [ ] Autenticación con JWT (email/password y Google OAuth)
- [ ] Datos reales desde API REST o GraphQL
- [ ] AsyncStorage para persistir sesión

### Iteración 3 — Funcionalidades de turista
- [ ] Pantalla de Reservas real (listado + estados)
- [ ] Sistema de Favoritos persistido en base de datos
- [ ] Notificaciones push (Expo Notifications)
- [ ] Búsqueda con geolocalización (Expo Location)

### Iteración 4 — Funcionalidades de proveedor
- [ ] Editor de publicaciones existentes
- [ ] Galería de fotos funcional (Expo ImagePicker)
- [ ] Selector de fechas (DateTimePicker)
- [ ] Mapa interactivo (react-native-maps)
- [ ] Mensajería en tiempo real (WebSockets)
- [ ] Estadísticas con datos reales

### Iteración 5 — Calidad y producción
- [ ] Tipado con TypeScript
- [ ] Tests unitarios (Jest) y E2E (Detox)
- [ ] Internacionalización (i18n)
- [ ] Modo oscuro completo
- [ ] Fuente custom Plus Jakarta Sans (expo-google-fonts)
- [ ] CI/CD con GitHub Actions + EAS

---

## 16. Registro de decisiones

| # | Decisión | Alternativa | Razón |
|---|----------|-------------|-------|
| 1 | JavaScript (no TypeScript) | TypeScript | MVP rápido; TS se agrega en iteración 5 |
| 2 | Stack + BottomTabs de React Navigation | Expo Router | React Navigation es más maduro y flexible para estructuras complejas; Expo Router es mejor para nuevos proyectos con file-based routing |
| 3 | ProviderAreaStack como stack interno | ProviderTabs directamente en AppNavigator | Permite pushear NuevaPublicacion sobre los tabs, que es el UX correcto |
| 4 | ExplorarStack dentro de TouristTabs | DetalleOferta en AppNavigator | Las tabs deben ocultarse al ver el detalle de una oferta |
| 5 | `navigation.reset()` en login exitoso | `navigation.navigate()` | Evita que el botón Atrás regrese al formulario de login |
| 6 | `navigation.navigate('LoginProveedor')` desde PerfilScreen | Pasar `navigation` del padre como prop | React Navigation v6 hace bubble automático hacia el Stack que contiene la ruta |
| 7 | Imágenes de picsum.photos | URLs de Google CDN del mock | Los URLs de Google CDN del mock son autenticados y no funcionan en React Native |
| 8 | BarChart custom con View nativas | victory-native o react-native-chart-kit | Evitar dependencias extra; el gráfico del mock es simple |
| 9 | `useState` local en OfertaCard para favorito | Estado global / Context | Los favoritos son solo visuales en el MVP; no se persisten |
| 10 | SafeAreaView de react-native-safe-area-context | SafeAreaView de react-native | La versión de RNSA-context es más confiable y necesaria para React Navigation |

---

## 17. Historial de cambios

### v1.1 — Feb 2026 (fidelidad al mock)

#### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `src/screens/ListadoOfertasScreen.js` | Agregada fila de filter chips (Filtros / Precio / Fechas / Nombre) con ScrollView horizontal. Visual decorativo, fiel al mock. |
| `src/screens/DetalleOfertaScreen.js` | Descripción truncada a 3 líneas con botón "Leer más / Leer menos" expandible (`descExpanded` con `useState`). |
| `src/navigation/ProviderTabs.js` | Agregado tab "Inicio" (icono `home`) como primera pestaña, apuntando a `MisPublicacionesScreen`. ProviderTabs pasó de 4 a 5 tabs: Inicio · Publicaciones · Estadísticas · Mensajes · Perfil. |

#### Contexto de los gaps corregidos
- **Filter chips:** El mock de `listado_de_ofertas` mostraba una fila de chips entre el buscador y los tabs de categoría. Ausentes en la versión inicial.
- **Leer más:** El mock de `detalle_de_oferta` mostraba el botón "Leer más" con ícono `expand_more`. La descripción siempre se mostraba completa.
- **Tab Inicio:** Todos los mocks del área proveedor (`administración_de_publicaciones`, `panel_de_estadísticas`, `nueva_publicación`) incluyen "Inicio" como primera tab del bottom nav. Ausente en la versión inicial.

#### Nota sobre el tab "Inicio" vs "Publicaciones"
El mock proveedor es inconsistente: cada pantalla mostraba su propio set de 4 tabs (mostrando/ocultando "Publicaciones" o "Estadísticas" según el screen activo). Esto no es compatible con React Native (el tab bar es fijo). La solución adoptada combina todos los tabs en una barra única de 5 items, que cubre todos los estados del mock.

---

### v1.0 — Feb 2026 (versión inicial MVP)
- Proyecto completo generado desde los 7 mockups de Stitch
- 23 archivos: 4 config · 1 theme · 1 data · 3 navigation · 10 screens · 4 components · 1 readme

---

*Proyecto generado a partir de mockups en Stitch (Google). Desarrollado como MVP de capacitación.*
*Tecnologías: React Native 0.76 · Expo SDK 52 · React Navigation v6 · JavaScript ES2022*
