'==========================================================
' CFA QUEST — ETHICS · Macro cho file minh hoa
'==========================================================
' PHAN A — dan vao Module thuong
'==========================================================

Public BangTatSuKien As Boolean

' Vung nhap dap an cua tung sheet
Public Function VungNhap(ByVal TenSheet As String) As String
    Select Case TenSheet
        Case "ARENA_1":    VungNhap = "G5:G19"
        Case "TRAP_I":     VungNhap = "I6:J15"
        Case "CROSSROADS": VungNhap = "I6:J15"
        Case "TRAP_II":    VungNhap = "I6:J15"
        Case "BOSS":       VungNhap = "I6:I20"
        Case Else:         VungNhap = ""
    End Select
End Function

' Xoa dap an cua cac Arena PHIA SAU mot Arena
Public Sub XoaXuoiDong(ByVal TuArenaSo As Integer)
    Dim ds As Variant, i As Integer
    ds = Array("ARENA_1", "TRAP_I", "CROSSROADS", "TRAP_II", "BOSS")
    BangTatSuKien = True
    Application.EnableEvents = False
    For i = TuArenaSo To 4
        ThisWorkbook.Worksheets(ds(i)).Range(VungNhap(CStr(ds(i)))).ClearContents
    Next i
    Application.EnableEvents = True
    BangTatSuKien = False
End Sub

' Nut: xoa toan bo dap an, bat dau luot moi
Public Sub XoaTatCaDapAn()
    If MsgBox("Xoa toan bo dap an da nhap o ca 5 Arena?", _
              vbYesNo + vbQuestion, "CFA Quest") = vbNo Then Exit Sub
    XoaXuoiDong 0
    ThisWorkbook.Worksheets("ARENA_1").Activate
    ThisWorkbook.Worksheets("ARENA_1").Range("G5").Select
    MsgBox "Da xoa. Nhap dap an Arena 1 de bat dau luot moi.", _
           vbInformation, "CFA Quest"
End Sub

' Kiem tra trang thai va bao "Let's retry!"
Public Sub KiemTraTrangThai(ByVal TenSheet As String, ByVal OTrangThai As String)
    Dim tt As String
    tt = CStr(ThisWorkbook.Worksheets(TenSheet).Range(OTrangThai).Value)
    If tt = "FAIL" Then
        MsgBox "Let's retry!" & vbCrLf & vbCrLf & _
               TenSheet & " duoi nguong dat. Luot choi ket thuc, " & _
               "cac Arena sau khong tai cau hoi." & vbCrLf & _
               "Sua dap an hoac bam nut Xoa dap an de choi lai.", _
               vbExclamation, "CFA Quest"
    End If
End Sub


'==========================================================
' PHAN B — dan vao cua so code CUA TUNG SHEET
'==========================================================

' ---- Sheet ARENA_1 ----
Private Sub Worksheet_Change(ByVal Target As Range)
    If BangTatSuKien Then Exit Sub
    If Intersect(Target, Me.Range("G5:G19")) Is Nothing Then Exit Sub
    XoaXuoiDong 1
    KiemTraTrangThai "ARENA_1", "B27"
End Sub

' ---- Sheet TRAP_I ----
 Private Sub Worksheet_Change(ByVal Target As Range)
     If BangTatSuKien Then Exit Sub
     If Intersect(Target, Me.Range("I6:J15")) Is Nothing Then Exit Sub
     XoaXuoiDong 2
     KiemTraTrangThai "TRAP_I", "B23"
 End Sub

' ---- Sheet CROSSROADS ----
 Private Sub Worksheet_Change(ByVal Target As Range)
     If BangTatSuKien Then Exit Sub
     If Intersect(Target, Me.Range("I6:J15")) Is Nothing Then Exit Sub
     XoaXuoiDong 3
     KiemTraTrangThai "CROSSROADS", "B23"
 End Sub

' ---- Sheet TRAP_II ----
 Private Sub Worksheet_Change(ByVal Target As Range)
     If BangTatSuKien Then Exit Sub
     If Intersect(Target, Me.Range("I6:J15")) Is Nothing Then Exit Sub
     XoaXuoiDong 4
     KiemTraTrangThai "TRAP_II", "B23"
 End Sub

' ---- Sheet BOSS ----
 Private Sub Worksheet_Change(ByVal Target As Range)
     If BangTatSuKien Then Exit Sub
     If Intersect(Target, Me.Range("I6:I20")) Is Nothing Then Exit Sub
     KiemTraTrangThai "BOSS", "B28"
 End Sub


