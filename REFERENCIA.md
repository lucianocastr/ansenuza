# Miramar de Ansenuza — Referencia Rápida

> v2.0 · Expo SDK 54 · React Native 0.81.5 · Supabase

---

## Comandos de ejecución

```bash
# Instalar dependencias (primera vez o tras clonar)
npm install

# Iniciar servidor de desarrollo
npx expo start

# Abrir directo en dispositivo/emulador
npx expo start --ios        # simulador iOS (requiere Mac + Xcode)
npx expo start --android    # emulador Android (requiere Android Studio)

# Escanear el QR con Expo Go (iOS/Android)
# → Expo Go debe ser versión SDK 54
```

---

## Rutas de navegación

### Estructura general

```
AppNavigator (Stack raíz)
│
├── [sin sesión]
│   ├── Bienvenida
│   ├── TouristArea  →  TouristTabs (5 tabs)
│   │   ├── Explorar → ExplorarStack
│   │   │   ├── ListadoOfertas
│   │   │   └── DetalleOferta
│   │   ├── Reservas    → Placeholder
│   │   ├── [FAB]       → Alert (próximamente)
│   │   ├── Favoritos   → Placeholder
│   │   └── Perfil      → PerfilScreen
│   └── LoginProveedor
│
└── [con sesión / autenticado]
    └── ProviderArea → ProviderAreaStack
        ├── ProviderTabs (5 tabs)
        │   ├── Inicio          → MisPublicaciones
        │   ├── Publicaciones   → MisPublicaciones
        │   ├── Estadísticas    → EstadisticasScreen
        │   ├── Mensajes        → Placeholder
        │   └── PerfilProveedor → PerfilProveedorScreen
        └── NuevaPublicacion  (push sobre tabs)
```

### Nombres de rutas (para `navigation.navigate`)

| Nombre de ruta | Pantalla | Área |
|---|---|---|
| `Bienvenida` | BienvenidaScreen | Turista |
| `TouristArea` | TouristTabs | Turista |
| `ListadoOfertas` | ListadoOfertasScreen | Turista |
| `DetalleOferta` | DetalleOfertaScreen | Turista |
| `LoginProveedor` | LoginProveedorScreen | Auth |
| `ProviderArea` | ProviderAreaStack | Proveedor |
| `ProviderTabs` | ProviderTabs | Proveedor |
| `Inicio` | MisPublicacionesScreen | Proveedor |
| `Publicaciones` | MisPublicacionesScreen | Proveedor |
| `Estadísticas` | EstadisticasScreen | Proveedor |
| `Mensajes` | PlaceholderScreen | Proveedor |
| `PerfilProveedor` | PerfilProveedorScreen | Proveedor |
| `NuevaPublicacion` | NuevaPublicacionScreen | Proveedor |

### Params de rutas

```js
// DetalleOferta — recibe el objeto completo de la oferta
navigation.navigate('DetalleOferta', { offer: offerObject })

// NuevaPublicacion — recibe callback para refrescar la lista
navigation.navigate('NuevaPublicacion', { onSuccess: refresh })
```

---

## Funcionalidades por pantalla

### Área turista

| Pantalla | Funcionalidades |
|---|---|
| **BienvenidaScreen** | Pantalla de entrada, botón "Continuar" → TouristArea |
| **ListadoOfertasScreen** | Búsqueda por texto (título/ubicación), filtro por categoría (Todos/Hospedaje/Negocio/Servicio), chips decorativos (Precio/Fechas/Nombre), lista de ofertas desde Supabase con spinner de carga |
| **DetalleOfertaScreen** | Imagen full, rating, precio, descripción expandible "Leer más", galería de reviews, botón favorito (local), campo de comentario, botón reservar (Alert) |
| **PerfilScreen** | Menú de opciones, acceso al portal proveedor |
| **PlaceholderScreen** | Pantalla genérica para Reservas, Favoritos, Mensajes |

### Autenticación

| Pantalla | Funcionalidades |
|---|---|
| **LoginProveedorScreen** | Email + contraseña, toggle ver/ocultar contraseña, checkbox "Recordarme", login con `supabase.auth.signInWithPassword()`, manejo de errores real |

### Área proveedor

| Pantalla | Funcionalidades |
|---|---|
| **MisPublicacionesScreen** | Stats dinámicas (Activas/Pendientes/Pausadas) calculadas desde DB, lista de publicaciones propias desde Supabase, FAB → NuevaPublicacion |
| **NuevaPublicacionScreen** | Form completo (categoría, título, descripción, precio, frecuencia, dirección), insert real en tabla `listings`, estado "Publicando...", callback `onSuccess` para refrescar lista |
| **EstadisticasScreen** | Período activo (Semanal/Mensual/Anual), 3 StatCards (vistas/reservas/ingresos), BarChart de datos semanales, top publicaciones |
| **PerfilProveedorScreen** | Datos del usuario autenticado (email, nombre, empresa), logout con `supabase.auth.signOut()` + confirmación Alert |

---

## Arquitectura de datos

### Supabase — Tablas

#### `offers` (lectura pública — RLS anon SELECT)
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid | PK generado automáticamente |
| title | text | Nombre de la oferta |
| category | text | Hospedaje / Negocio / Servicio |
| location | text | Ubicación descriptiva |
| rating | numeric(2,1) | Puntuación media |
| review_count | int | Cantidad de reseñas |
| price | numeric(10,2) | Precio base |
| price_suffix | text | /noche, /persona, etc. |
| price_label | text | Desde, Precio Fijo, etc. |
| image | text | URL de imagen |
| is_favorite | boolean | Favorito por defecto |
| badge | text | Etiqueta destacada (nullable) |
| discount | jsonb | `{percent, originalPrice, validUntil}` (nullable) |
| description | text | Descripción completa |
| phone | text | Teléfono de contacto |
| reviews | jsonb | Array de `{id, name, rating, comment, time, avatar}` |

#### `listings` (protegida — RLS por user_id)
| Campo | Tipo | Descripción |
|---|---|---|
| id | uuid | PK generado automáticamente |
| user_id | uuid | FK → auth.users.id |
| title | text | Nombre de la publicación |
| category | text | Hospedaje / Negocio / Servicio |
| location | text | Dirección o zona |
| description | text | Descripción |
| price | numeric(10,2) | Precio |
| price_suffix | text | /noche, /persona, /paquete |
| status | text | active / pending / paused |
| image | text | URL de imagen |

### Flujo de datos en la app

```
Supabase DB
    ↓ useOffers()          → ListadoOfertasScreen
    ↓ useListings()        → MisPublicacionesScreen
    ↓ .insert('listings')  ← NuevaPublicacionScreen

Supabase Auth
    ↓ signInWithPassword() ← LoginProveedorScreen
    ↓ signOut()            ← PerfilProveedorScreen
    ↓ onAuthStateChange()  → AuthContext → AppNavigator
    ↓ getSession()         → persistencia via AsyncStorage
```

---

## Archivos clave

```
AnsenuZaApp/
├── App.js                          Entry: SafeAreaProvider + AuthProvider + AppNavigator
├── app.json                        Config Expo (slug, orientation, bundleId)
├── babel.config.js                 Preset: babel-preset-expo
├── package.json                    Expo SDK 54, RN 0.81.5, React 19.1.0
└── src/
    ├── lib/
    │   └── supabase.js             Cliente Supabase + AsyncStorage (⚠ credenciales acá)
    ├── context/
    │   └── AuthContext.js          user, loading, onAuthStateChange
    ├── hooks/
    │   ├── useOffers.js            fetch offers table → {offers, loading, error}
    │   └── useListings.js          fetch listings by user → {listings, loading, error, refresh}
    ├── theme/
    │   └── colors.js               primary: #9e4fde — paleta centralizada
    ├── data/
    │   └── mockData.js             providerStats (EstadisticasScreen aún usa mock)
    ├── navigation/
    │   ├── AppNavigator.js         Stack raíz + auth-based routing
    │   ├── TouristTabs.js          5 tabs turista + ExplorarStack + FABButton
    │   └── ProviderTabs.js         5 tabs proveedor
    ├── screens/                    10 pantallas
    └── components/
        ├── OfertaCard.js           Tarjeta de oferta turística
        ├── StatCard.js             Tarjeta de estadística con trend
        ├── ListingItem.js          Item de publicación del proveedor
        └── BarChart.js             Gráfico de barras nativo (sin librerías externas)
```

---

## Estado por funcionalidad

| Funcionalidad | Estado | Fuente de datos |
|---|---|---|
| Listado de ofertas | ✅ Real | Supabase `offers` |
| Detalle de oferta | ✅ Real | Parámetro de ruta |
| Login proveedor | ✅ Real | Supabase Auth |
| Logout | ✅ Real | Supabase Auth |
| Sesión persistente | ✅ Real | AsyncStorage |
| Mis publicaciones | ✅ Real | Supabase `listings` |
| Crear publicación | ✅ Real | Supabase `listings` |
| Estadísticas panel | ⚠ Mock | mockData.providerStats |
| Favoritos | 🚧 Placeholder | — |
| Reservas | 🚧 Placeholder | — |
| Mensajes | 🚧 Placeholder | — |
| Editar publicación | 🚧 Sin implementar | — |

---

## Credenciales demo

- **Supabase URL:** configurada en `src/lib/supabase.js`
- **Usuario proveedor:** crear en Supabase Auth Dashboard
- **RLS:** `offers` es pública (SELECT anon), `listings` solo el dueño

---

*Expo SDK 54 · React Native 0.81.5 · React 19.1.0 · Supabase v2*
