import 'package:flutter/material.dart';
import 'package:agendly_app/config/helpers/responsive.dart';

/// Pantalla de demostración de la clase Responsive
/// Muestra cómo se adapta la UI a diferentes tamaños de pantalla
class ResponsiveDemoScreen extends StatelessWidget {
  const ResponsiveDemoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final responsive = Responsive.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Demo Responsive'),
        toolbarHeight: responsive.hScreen(8),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(responsive.iScreen(2)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Información del dispositivo
            _buildDeviceInfo(context, responsive),
            
            SizedBox(height: responsive.hScreen(3)),
            
            // Ejemplos de dimensiones
            _buildDimensionsExample(context, responsive),
            
            SizedBox(height: responsive.hScreen(3)),
            
            // Ejemplos de texto
            _buildTextExample(context, responsive),
            
            SizedBox(height: responsive.hScreen(3)),
            
            // Ejemplos de grid
            _buildGridExample(context, responsive),
            
            SizedBox(height: responsive.hScreen(3)),
            
            // Ejemplos de botones
            _buildButtonsExample(context, responsive),
            
            SizedBox(height: responsive.hScreen(3)),
          ],
        ),
      ),
    );
  }

  Widget _buildDeviceInfo(BuildContext context, Responsive responsive) {
    final aspectRatio = responsive.width / responsive.height;
    final isPortrait = responsive.height > responsive.width;
    final textScale = MediaQuery.textScalerOf(context).scale(1.0);
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(responsive.iScreen(2)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '📱 Información del Dispositivo',
              style: TextStyle(
                fontSize: responsive.iScreen(1.6),
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: responsive.hScreen(2)),
            _buildInfoRow('Ancho', '${responsive.width.toStringAsFixed(1)} px', responsive),
            _buildInfoRow('Alto', '${responsive.height.toStringAsFixed(1)} px', responsive),
            _buildInfoRow('Diagonal', '${responsive.inch.toStringAsFixed(1)} px', responsive),
            _buildInfoRow('Aspect Ratio', aspectRatio.toStringAsFixed(2), responsive),
            _buildInfoRow('Orientación', isPortrait ? '📱 Vertical' : '📱 Horizontal', responsive),
            _buildInfoRow('Tipo', _getDeviceType(responsive), responsive),
            _buildInfoRow('Text Scale', textScale.toStringAsFixed(2), responsive),
          ],
        ),
      ),
    );
  }

  Widget _buildDimensionsExample(BuildContext context, Responsive responsive) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(responsive.iScreen(2)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '📏 Ejemplos de Dimensiones',
              style: TextStyle(
                fontSize: responsive.iScreen(1.6),
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: responsive.hScreen(2)),
            
            // 50% de ancho
            Container(
              width: responsive.wScreen(50),
              height: responsive.hScreen(5),
              color: Colors.blue,
              alignment: Alignment.center,
              child: Text(
                '50% Ancho',
                style: TextStyle(color: Colors.white, fontSize: responsive.iScreen(1.2)),
              ),
            ),
            
            SizedBox(height: responsive.hScreen(1)),
            
            // 80% de ancho
            Container(
              width: responsive.wScreen(80),
              height: responsive.hScreen(5),
              color: Colors.green,
              alignment: Alignment.center,
              child: Text(
                '80% Ancho',
                style: TextStyle(color: Colors.white, fontSize: responsive.iScreen(1.2)),
              ),
            ),
            
            SizedBox(height: responsive.hScreen(1)),
            
            // 100% de ancho
            Container(
              width: responsive.wScreen(100),
              height: responsive.hScreen(5),
              color: Colors.orange,
              alignment: Alignment.center,
              child: Text(
                '100% Ancho',
                style: TextStyle(color: Colors.white, fontSize: responsive.iScreen(1.2)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextExample(BuildContext context, Responsive responsive) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(responsive.iScreen(2)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '📝 Ejemplos de Texto Responsivo',
              style: TextStyle(
                fontSize: responsive.iScreen(1.6),
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: responsive.hScreen(2)),
            Text(
              'Texto Pequeño (sp 10)',
              style: TextStyle(fontSize: responsive.iScreen(1.0)),
            ),
            SizedBox(height: responsive.hScreen(1)),
            Text(
              'Texto Normal (sp 14)',
              style: TextStyle(fontSize: responsive.iScreen(1.4)),
            ),
            SizedBox(height: responsive.hScreen(1)),
            Text(
              'Texto Grande (sp 18)',
              style: TextStyle(fontSize: responsive.iScreen(1.8)),
            ),
            SizedBox(height: responsive.hScreen(1)),
            Text(
              'Texto Muy Grande (sp 24)',
              style: TextStyle(fontSize: responsive.iScreen(2.4)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridExample(BuildContext context, Responsive responsive) {
    final isTablet = responsive.width >= 600;
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(responsive.iScreen(2)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '🔲 Grid Adaptable',
              style: TextStyle(
                fontSize: responsive.iScreen(1.6),
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              isTablet ? '4 columnas (Tablet)' : '2 columnas (Móvil)',
              style: TextStyle(
                fontSize: responsive.iScreen(1.2),
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: responsive.hScreen(2)),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: isTablet ? 4 : 2,
                crossAxisSpacing: responsive.wScreen(2),
                mainAxisSpacing: responsive.hScreen(1),
                childAspectRatio: 1.5,
              ),
              itemCount: 8,
              itemBuilder: (context, index) {
                return Container(
                  decoration: BoxDecoration(
                    color: Colors.primaries[index % Colors.primaries.length],
                    borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    '${index + 1}',
                    style: TextStyle(
                      fontSize: responsive.iScreen(1.6),
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildButtonsExample(BuildContext context, Responsive responsive) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(responsive.iScreen(2)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '🔘 Botones Responsivos',
              style: TextStyle(
                fontSize: responsive.iScreen(1.6),
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: responsive.hScreen(2)),
            
            // Botón pequeño
            SizedBox(
              width: responsive.wScreen(40),
              height: responsive.hScreen(5),
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                  ),
                ),
                child: Text(
                  'Pequeño',
                  style: TextStyle(fontSize: responsive.iScreen(1.2)),
                ),
              ),
            ),
            
            SizedBox(height: responsive.hScreen(1)),
            
            // Botón mediano
            SizedBox(
              width: responsive.wScreen(60),
              height: responsive.hScreen(6),
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                  ),
                ),
                child: Text(
                  'Mediano',
                  style: TextStyle(fontSize: responsive.iScreen(1.4)),
                ),
              ),
            ),
            
            SizedBox(height: responsive.hScreen(1)),
            
            // Botón grande
            SizedBox(
              width: responsive.wScreen(90),
              height: responsive.hScreen(7),
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(responsive.iScreen(1)),
                  ),
                ),
                child: Text(
                  'Grande',
                  style: TextStyle(fontSize: responsive.iScreen(1.6)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, Responsive responsive) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: responsive.hScreen(0.5)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: responsive.iScreen(1.2),
              color: Colors.grey[700],
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: responsive.iScreen(1.2),
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  String _getDeviceType(Responsive responsive) {
    if (responsive.width >= 600) return '📱 Tablet';
    if (responsive.width < 360) return '📱 Teléfono Pequeño';
    if (responsive.width < 400) return '📱 Teléfono Mediano';
    if (responsive.width >= 400) return '📱 Teléfono Grande';
    return '📱 Móvil';
  }
}
