### Các bước thực hiện :
-B1 : Clone dự án nếu chưa
-B2 : `git feath origin`
-B3 : `git pull origin develop` (Trước khi bắt đầu làm việc, luôn cập nhật nhánh develop để tránh xung đột (làm điều này trước khi bắt đầu làm việc mỗi ngày).)
Lưu ý: Nếu đang làm việc trên một tính năng mới, hãy chắc chắn rằng đã pull mới nhất từ develop để tránh sửa lỗi trên mã cũ
-B4 : `git checkout develop` để đổi qua nhánh develop( mình chỉ sử dụng nhánh này, nhánh main là nhánh triển khai,hợp nhất khi không còn lỗi , Anh là người hợp nhất)
-B5 : `git checkout -b dev/tên dev`(ví dụ git checkout -b dev/ducanh) để tạo ra nhánh riêng để làm việc(sẽ tự động pull code hiện tại trên nhánh develop)( cái này tạo 1 lần thôi, lần sau mình cứ làm trên nhánh này)
-B6 : `git checkout <tên-nhánh-vừa-tạo>` :  để vào làm việc (ví dụ git checkout develop/ducanh) 
-B7 : Bước ni cũng quan trọng , sau khi làm việc xong thì không nên `git add .` mình chỉ add file mình làm hoặc sửa thôi( ví dụ mình có 3 file index , home , base , nếu mình chỉ sửa index với home thì sử dụng lệnh 
`git add index home` )
-B8 : nhớ commit : `git commit -m " xài ing lich cho sang "` ngắn gọn dễ hiểu nhất nha
-B9 : Cũng quan trọng , mình sẽ push code lên chính nhánh mình đang làm việc
`git push -u origin + tên nhánh`(tuyệt đối ko dc push lên main hay develop chỉ push lên nhánh mình làm ) ví dụ `git push -u origin develop/ducanh`
-B10 : Nói với Anh để Anh tổng hợp lại nghen
