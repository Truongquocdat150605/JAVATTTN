import zipfile, xml.etree.ElementTree as ET
import os

def extract_text_from_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.XML(xml_content)
            NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
            paragraphs = []
            for paragraph in tree.iter(NAMESPACE + 'p'):
                texts = [node.text for node in paragraph.iter(NAMESPACE + 't') if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            return '\n'.join(paragraphs)
    except Exception as e:
        return str(e)

file1 = r'C:\Users\DAT\OneDrive\Desktop\TTTN\ChucNang_LuongNghiepVu_QuanLyPhongTro.docx'
file2 = r'C:\Users\DAT\OneDrive\Desktop\TTTN\decuong_web_quanly_phongtro_hoan_thien.docx'

with open(r'd:\Web_java\Java_QLPhongTRo\docx_output.txt', 'w', encoding='utf-8') as f:
    f.write('--- ChucNang_LuongNghiepVu_QuanLyPhongTro.docx ---\n')
    f.write(extract_text_from_docx(file1))
    f.write('\n\n--- decuong_web_quanly_phongtro_hoan_thien.docx ---\n')
    f.write(extract_text_from_docx(file2))
