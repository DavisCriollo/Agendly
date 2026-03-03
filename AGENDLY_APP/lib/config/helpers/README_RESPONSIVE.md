# 📱 Guía de Uso: Clase Responsive

La clase `Responsive` permite crear interfaces adaptables a cualquier tamaño de pantalla móvil, desde teléfonos pequeños hasta tablets.

## 📋 Índice
- [Instalación](#instalación)
- [Uso Básico](#uso-básico)
- [Métodos Principales](#métodos-principales)
- [Detección de Dispositivos](#detección-de-dispositivos)
- [Extensiones de BuildContext](#extensiones-de-buildcontext)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Mejores Prácticas](#mejores-prácticas)

---

## 🚀 Instalación

La clase ya está ubicada en: `lib/config/helpers/responsive.dart`

Para usarla, simplemente importa:

```dart
import 'package:agendly_app/config/helpers/responsive.dart';
```

---

## 💡 Uso Básico

### Forma 1: Crear una instancia

```dart
@override
Widget build(BuildContext context) {
  final responsive = Responsive.of(context);
  
  return Container(
    width: responsive.wp(80),  // 80% del ancho
    height: responsive.hp(50), // 50% del alto
  );
}
```

### Forma 2: Usar la extensión (Recomendado)

```dart
@override
Widget build(BuildContext context) {
  return Container(
    width: context.wp(80),  // 80% del ancho
    height: context.hp(50), // 50% del alto
  );
}
```

---

## 📏 Métodos Principales

### Dimensiones Responsivas

| Método | Descripción | Ejemplo |
|--------|-------------|---------|
| `wp(percent)` | Porcentaje del **ancho** de pantalla | `wp(50)` = 50% del ancho |
| `hp(percent)` | Porcentaje del **alto** de pantalla | `hp(30)` = 30% del alto |
| `ip(percent)` | Porcentaje de la **diagonal** de pantalla | `ip(5)` = 5% de la diagonal |
| `sp(size)` | Tamaño de **texto** responsivo | `sp(16)` = texto adaptable |

### Espaciado

```dart
// Espacios verticales
responsive.verticalSpace(2)  // SizedBox con 2% de altura

// Espacios horizontales
responsive.horizontalSpace(3)  // SizedBox con 3% de ancho

// Padding
responsive.paddingAll(2)           // EdgeInsets.all con 2% de diagonal
responsive.paddingHorizontal(4)    // Padding horizontal del 4%
responsive.paddingVertical(3)      // Padding vertical del 3%
```

---

## 📱 Detección de Dispositivos

### Propiedades Booleanas

```dart
final responsive = Responsive.of(context);

// Tipo de dispositivo
if (responsive.isTablet) {
  // Código para tablets (diagonal > 7")
}

if (responsive.isSmallPhone) {
  // Código para teléfonos pequeños (diagonal < 5")
}

if (responsive.isMediumPhone) {
  // Código para teléfonos medianos (5" - 6")
}

if (responsive.isLargePhone) {
  // Código para teléfonos grandes (6" - 7")
}

// Orientación
if (responsive.isLandscape) {
  // Modo horizontal
}

if (responsive.isPortrait) {
  // Modo vertical
}
```

### Método `getValueForScreenType`

```dart
final padding = responsive.getValueForScreenType(
  mobile: 8.0,        // Valor por defecto
  tablet: 16.0,       // Valor para tablets
  smallPhone: 4.0,    // Valor para teléfonos pequeños
);
```

---

## 🔧 Extensiones de BuildContext

Acceso directo sin crear instancia:

```dart
@override
Widget build(BuildContext context) {
  return Container(
    width: context.wp(90),
    height: context.hp(40),
    padding: EdgeInsets.all(context.ip(2)),
    child: Text(
      'Hola',
      style: TextStyle(fontSize: context.sp(16)),
    ),
  );
}
```

---

## 🎯 Ejemplos Prácticos

### 1. Card Responsivo

```dart
Card(
  margin: EdgeInsets.all(context.ip(2)),
  child: Container(
    width: context.wp(90),
    padding: context.responsive.paddingAll(2),
    child: Column(
      children: [
        Text(
          'Título',
          style: TextStyle(fontSize: context.sp(18)),
        ),
        context.responsive.verticalSpace(2),
        Text(
          'Contenido',
          style: TextStyle(fontSize: context.sp(14)),
        ),
      ],
    ),
  ),
)
```

### 2. Grid Adaptable

```dart
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: context.responsive.isTablet ? 4 : 2,
    crossAxisSpacing: context.wp(2),
    mainAxisSpacing: context.hp(1),
  ),
  itemBuilder: (context, index) {
    return Container(
      height: context.hp(20),
      // ...
    );
  },
)
```

### 3. Botón Responsivo

```dart
ElevatedButton(
  onPressed: () {},
  style: ElevatedButton.styleFrom(
    minimumSize: Size(
      context.wp(80),  // 80% del ancho
      context.hp(6),   // 6% del alto
    ),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(context.ip(1)),
    ),
  ),
  child: Text(
    'Continuar',
    style: TextStyle(fontSize: context.sp(16)),
  ),
)
```

### 4. AppBar con Altura Responsiva

```dart
AppBar(
  toolbarHeight: context.hp(8),  // 8% del alto
  title: Text(
    'Mi App',
    style: TextStyle(fontSize: context.sp(18)),
  ),
)
```

### 5. Formulario Responsivo

```dart
Form(
  child: Column(
    children: [
      TextFormField(
        style: TextStyle(fontSize: context.sp(14)),
        decoration: InputDecoration(
          contentPadding: EdgeInsets.symmetric(
            horizontal: context.wp(4),
            vertical: context.hp(2),
          ),
        ),
      ),
      context.responsive.verticalSpace(2),
      // Más campos...
    ],
  ),
)
```

---

## ✅ Mejores Prácticas

### 1. **Usa porcentajes consistentes**
```dart
// ✅ Bueno
Container(
  width: context.wp(90),
  padding: EdgeInsets.all(context.ip(2)),
)

// ❌ Evitar valores fijos
Container(
  width: 300,  // No se adapta
  padding: EdgeInsets.all(16),  // No se adapta
)
```

### 2. **Usa `ip()` para elementos que deben escalar proporcionalmente**
```dart
// Para iconos, bordes, padding general
Icon(Icons.home, size: context.ip(4))
BorderRadius.circular(context.ip(1.5))
```

### 3. **Usa `wp()` y `hp()` para dimensiones específicas**
```dart
// Ancho de contenedores
Container(width: context.wp(80))

// Alto de imágenes
Image(height: context.hp(30))
```

### 4. **Usa `sp()` para texto**
```dart
Text(
  'Título',
  style: TextStyle(fontSize: context.sp(18)),
)
```

### 5. **Adapta layouts según el dispositivo**
```dart
GridView.count(
  crossAxisCount: context.responsive.isTablet ? 4 : 2,
  // ...
)
```

### 6. **Usa la extensión para código más limpio**
```dart
// ✅ Recomendado
context.wp(80)
context.hp(50)
context.sp(16)

// ✅ También válido
final responsive = Responsive.of(context);
responsive.wp(80)
```

---

## 🎨 Valores Recomendados

### Padding y Margin
- Pequeño: `ip(1)` o `ip(1.5)`
- Mediano: `ip(2)` o `ip(2.5)`
- Grande: `ip(3)` o `ip(4)`

### Tamaños de Texto
- Pequeño: `sp(12)` - `sp(14)`
- Normal: `sp(14)` - `sp(16)`
- Título: `sp(18)` - `sp(24)`
- Grande: `sp(28)` - `sp(36)`

### Iconos
- Pequeño: `ip(3)` - `ip(4)`
- Mediano: `ip(5)` - `ip(6)`
- Grande: `ip(7)` - `ip(10)`

### Botones
- Altura: `hp(5)` - `hp(7)`
- Ancho: `wp(80)` - `wp(90)`

---

## 🐛 Solución de Problemas

### Problema: Los elementos se ven muy grandes/pequeños

**Solución**: Ajusta los porcentajes. Recuerda que `ip()` escala con la diagonal, mientras que `wp()` y `hp()` son más específicos.

### Problema: El texto no se adapta bien

**Solución**: Usa `sp()` en lugar de valores fijos. También considera usar `maxLines` y `overflow`.

```dart
Text(
  'Texto largo',
  style: TextStyle(fontSize: context.sp(14)),
  maxLines: 2,
  overflow: TextOverflow.ellipsis,
)
```

---

## 📚 Recursos Adicionales

- Ver ejemplos completos en: `lib/config/helpers/responsive_usage_example.dart`
- Documentación de Flutter: [Responsive Design](https://docs.flutter.dev/ui/layout/responsive)

---

**¡Ahora tu app se adaptará perfectamente a cualquier dispositivo móvil!** 🎉
