import sys
from PyQt5.QtWidgets import QApplication, QDialog, QLabel, QComboBox, QPushButton, QVBoxLayout, QMessageBox

class ThemeSelector(QDialog):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("OpenLP Theme Selector")
        self.setFixedSize(400, 200)

        # Layout
        layout = QVBoxLayout()

        # Song Theme Selection
        self.song_label = QLabel("Select Song Theme:")
        self.song_combobox = QComboBox()

        # Bible Theme Selection
        self.bible_label = QLabel("Select Bible Theme:")
        self.bible_combobox = QComboBox()

        # Load themes into combo boxes
        self.load_themes()

        # Button
        self.create_button = QPushButton("Create settings.js")
        self.create_button.clicked.connect(self.create_settings)

        # Add Widgets to Layout
        layout.addWidget(self.song_label)
        layout.addWidget(self.song_combobox)
        layout.addWidget(self.bible_label)
        layout.addWidget(self.bible_combobox)
        layout.addWidget(self.create_button)

        self.setLayout(layout)

    def load_themes(self):
        try:
            with open('themelist.ls', 'r') as file:
                next(file)  # Skip header line
                for line in file:
                    stripped_line = line.strip()
                    if not stripped_line:  # Skip empty lines
                        continue
                    parts = stripped_line.split(',')
                    if len(parts) != 2:  # Ensure there are exactly 2 parts
                        continue
                    type_, name = parts

                    if type_ == 'song':
                        self.song_combobox.addItem(name.strip())
                    elif type_ == 'bible':
                        self.bible_combobox.addItem(name.strip())

        except FileNotFoundError:
            QMessageBox.warning(self, "File Error", "themelist.ls not found.")

    def create_settings(self):
        song_theme = self.song_combobox.currentText()
        bible_theme = self.bible_combobox.currentText()

        if not song_theme or not bible_theme:
            QMessageBox.warning(self, "Selection Error", "Please select both themes.")
            return

        settings_content = f"var mycursong = '{song_theme}';\nvar mycurbible = '{bible_theme}';\n"
        
        with open("settings.js", 'w') as file:
            file.write(settings_content)
        
        QMessageBox.information(self, "Success", "settings.js has been created successfully!")

# Main application entry
if __name__ == '__main__':
    app = QApplication(sys.argv)
    dialog = ThemeSelector()
    dialog.exec_()