import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomText extends StatelessWidget {
  final String text;
  final double fontSize;
  final Color? color;
  final FontWeight fontWeight;
  final TextAlign textAlign;
  final TextOverflow overflow;
  final int? maxLines;

  const CustomText({
    super.key,
    required this.text,
    required this.fontSize,
    this.color,
    this.fontWeight = FontWeight.normal,
    this.textAlign = TextAlign.start,
    this.overflow = TextOverflow.ellipsis,
    this.maxLines,
  });

  const CustomText.title({
    super.key,
    required this.text,
    required this.fontSize,
    this.color = Colors.white,
    this.fontWeight = FontWeight.bold,
    this.textAlign = TextAlign.start,
    this.maxLines = 1,
  }) : overflow = TextOverflow.ellipsis;

  const CustomText.subtitle({
    super.key,
    required this.text,
    required this.fontSize,
    this.color = Colors.grey,
    this.fontWeight = FontWeight.w500,
    this.textAlign = TextAlign.start,
    this.maxLines = 2,
  }) : overflow = TextOverflow.ellipsis;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: textAlign,
      overflow: overflow,
      maxLines: maxLines,
      style: GoogleFonts.roboto(
        fontSize: fontSize,
        color: color,
        fontWeight: fontWeight,
      ),
    );
  }
}
