#!/usr/bin/python3
# coding: utf-8
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *
from PyQt5.QtGui import *
import sys

class MainWindow(QMainWindow): 
  def __init__(self):
    super(MainWindow, self).__init__() 
    self.setWindowTitle("数字予測マジック")

    self.step = 0
    self.max_step = 6
    self.selected_num = 0
    all = range(1,101)
    self.bits = [[] for j in range(self.max_step+1)]
    for num in all:
      for j in range(self.max_step+1):
        if bin(num & 2**j) == bin(2**j):
          self.bits[j] += [num]

    self._font = QFont()
    self._font.setPointSize(32)
    self._font.setBold(True)
    
    # === 中央ウィジェットの生成 ====================
    self.centralWidget = QWidget()
    self.setCentralWidget(self.centralWidget)
        
    # === メインレイアウトの配置 ====================
    self.main_vlayout = QVBoxLayout()
    self.centralWidget.setLayout(self.main_vlayout)

    # === メインレイアウトの中身 ====================
    upper_hlayout = QHBoxLayout()
    lower_hlayout = QHBoxLayout()

    self.main_vlayout.addLayout(upper_hlayout)
    self.main_vlayout.addLayout(lower_hlayout)
    self.setContentsMargins(0, 0, 0, 0)

    # === upper_hlayoutの中身 ======
    self.grid_layout = QGridLayout()
    self.grid_layout.setContentsMargins(60, 40, 60, 40)
    upper_hlayout.addLayout(self.grid_layout)
    
    # === lower_hlayoutの中身 ======
    yes_btn = QPushButton('ある')
    yes_btn.setShortcut("1")
    yes_btn.clicked.connect(lambda: self.updateScreen(True))
    yes_btn.setSizePolicy(QSizePolicy.Expanding, 200)
    yes_btn.setStyleSheet("background-color: red; color: white;")
    lower_hlayout.addWidget(yes_btn)
    
    no_btn = QPushButton('ない')
    no_btn.setShortcut("0")
    no_btn.clicked.connect(lambda: self.updateScreen(False))
    no_btn.setSizePolicy(QSizePolicy.Expanding, 200)
    no_btn.setStyleSheet("background-color: blue; color: white;")
    lower_hlayout.addWidget(no_btn)

    self.createScreen(self.step)

  def createScreen(self, step):
    for j, bit in enumerate(self.bits[step]):
      row = j / 10
      col = j % 10
      label = QLabel(str(bit))
      label.setAlignment(Qt.AlignCenter)
      label.setFont(self._font)
      self.grid_layout.addWidget(label, row, col)
   
  def updateScreen(self, is_there):
    if is_there == True:
      self.selected_num += self.bits[self.step][0]
    if self.step == self.max_step:
      self.showResult()
      return
    self.step += 1
    self.clearWidgets()
    self.createScreen(self.step)

  def clearWidgets(self):
    # self.centralWidget.deleteLater()
    for i in reversed(range(self.grid_layout.count())): 
      self.grid_layout.itemAt(i).widget().setParent(None)

  def showResult(self):
    msg_box = QMessageBox(self)
    msg_box.setWindowTitle("結果発表")
    msg_box.setStyleSheet("width: 400px;")
    msg_box.setText('あなたの選んだ数字は <span style="color: red">'+str(self.selected_num)+'</span> ですね?')
    msg_box.setIcon(QMessageBox.Information)
    restart_btn = msg_box.addButton("最初から", QMessageBox.ActionRole)
    quit_btn = msg_box.addButton("アプリを終了", QMessageBox.ActionRole)
    msg_box.setDefaultButton(restart_btn)
    msg_box.exec_()

    msg_box.setStandardButtons(QMessageBox.Ok)
    msg_box.setDefaultButton(QMessageBox.Ok)
    msg_box.setEscapeButton(QMessageBox.Ok)

    if msg_box.clickedButton() == restart_btn:
      self.step = 0
      self.selected_num = 0
      self.clearWidgets()
      self.createScreen(self.step)
    elif msg_box.clickedButton() == quit_btn:
      quit()

# === main process ==============================================
def main():
  app = QApplication(sys.argv)
  desktop = app.desktop()
  height = desktop.height()
  width = desktop.width()
  window = MainWindow()
  window.setGeometry(200, 200, width*0.8, height*0.8)
  window.show()
  sys.exit(app.exec_())
    
if __name__ == '__main__':
  main()
