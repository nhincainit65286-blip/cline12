# Đóng góp cho Cline

Chúng tôi rất vui vì bạn quan tâm đến việc đóng góp cho Cline. Dù bạn đang sửa lỗi, thêm tính năng hay cải thiện tài liệu, mỗi đóng góp đều giúp Cline trở nên thông minh hơn! Để duy trì cộng đồng sôi động và thân thiện, tất cả thành viên phải tuân thủ [quy tắc ứng xử](CODE_OF_CONDUCT.md) của chúng tôi.

## Báo cáo lỗi hoặc vấn đề

Báo cáo lỗi giúp Cline tốt hơn cho mọi người! Trước khi tạo issue mới, vui lòng [tìm kiếm các issue hiện có](https://github.com/cline/cline/issues) để tránh trùng lặp. Khi bạn sẵn sàng báo cáo lỗi, hãy truy cập [trang issue](https://github.com/cline/cline/issues/new/choose) của chúng tôi, nơi bạn sẽ tìm thấy template giúp bạn điền thông tin liên quan.

<blockquote class='warning-note'>
    🔐 <b>Quan trọng:</b> Nếu bạn phát hiện lỗ hổng bảo mật, vui lòng <a href="https://github.com/cline/cline/security/advisories/new">báo cáo riêng tư bằng công cụ bảo mật Github</a>.
</blockquote>

## Quyết định làm gì

Đang tìm kiếm đóng góp đầu tiên phù hợp? Hãy xem các issue được đánh dấu ["good first issue"](https://github.com/cline/cline/labels/good%20first%20issue) hoặc ["help wanted"](https://github.com/cline/cline/labels/help%20wanted). Đây là những lĩnh vực được chọn lọc đặc biệt cho contributor mới, và chúng tôi rất hoan nghênh sự giúp đỡ của bạn!

Chúng tôi cũng hoan nghênh đóng góp cho [tài liệu](https://github.com/cline/cline/tree/main/docs) của chúng tôi! Dù là sửa lỗi chính tả, cải thiện hướng dẫn hiện có, hay tạo nội dung giáo dục mới - chúng tôi muốn xây dựng một kho tài nguyên do cộng đồng thúc đẩy để giúp mọi người tận dụng tối đa Cline. Bạn có thể bắt đầu bằng cách tìm hiểu thư mục `/docs` và tìm những chỗ cần cải thiện.

Nếu bạn dự định phát triển một tính năng lớn hơn, vui lòng tạo [yêu cầu tính năng](https://github.com/cline/cline/discussions/categories/feature-requests?discussions_q=is%3Aopen+category%3A%22Feature+Requests%22+sort%3Atop) trước để chúng ta có thể thảo luận xem nó có phù hợp với tầm nhìn của Cline không.

## Thiết lập phát triển

1. **Extension VS Code**

    - Khi mở dự án, VS Code sẽ nhắc bạn cài đặt các extension được đề xuất
    - Các extension này là cần thiết cho phát triển - vui lòng chấp nhận tất cả lời nhắc cài đặt
    - Nếu bạn bỏ qua lời nhắc, bạn có thể cài đặt thủ công từ bảng extension

2. **Phát triển local**
    - Chạy `npm run install:all` để cài đặt dependencies
    - Chạy `npm run test` để chạy test local
    - Trước khi submit PR, chạy `npm run format:fix` để format code của bạn

## Viết và submit code

Bất kỳ ai cũng có thể đóng góp code cho Cline, nhưng chúng tôi yêu cầu bạn tuân theo các hướng dẫn sau để đảm bảo đóng góp của bạn được tích hợp suôn sẻ:

1. **Giữ Pull Request tập trung**

    - Giới hạn PR cho một tính năng hoặc sửa lỗi duy nhất
    - Chia các thay đổi lớn thành các PR nhỏ hơn có liên quan
    - Chia thay đổi thành các commit logic để có thể review độc lập

2. **Chất lượng code**

    - Chạy `npm run lint` để kiểm tra code style
    - Chạy `npm run format` để tự động format code
    - Tất cả PR phải pass các kiểm tra CI, bao gồm lint và format
    - Giải quyết tất cả cảnh báo hoặc lỗi ESLint trước khi submit
    - Tuân theo best practices TypeScript và duy trì type safety

3. **Testing**

    - Thêm test cho các tính năng mới
    - Chạy `npm test` để đảm bảo tất cả test pass
    - Nếu thay đổi của bạn ảnh hưởng đến test hiện có, hãy cập nhật chúng
    - Bao gồm unit test và integration test khi phù hợp

4. **Hướng dẫn commit**

    - Viết commit message rõ ràng, mô tả
    - Sử dụng định dạng conventional commit (ví dụ: "feat:", "fix:", "docs:")
    - Tham chiếu issue liên quan trong commit, sử dụng #issue-number

5. **Trước khi submit**

    - Rebase branch của bạn lên main mới nhất
    - Đảm bảo branch của bạn build thành công
    - Kiểm tra kỹ xem tất cả test có pass không
    - Kiểm tra thay đổi của bạn có debug code hoặc console log nào không

6. **Mô tả Pull Request**
    - Mô tả rõ ràng những gì bạn đã thay đổi
    - Bao gồm các bước để test thay đổi
    - Liệt kê bất kỳ breaking change nào
    - Đối với thay đổi UI, thêm screenshot

## Thỏa thuận đóng góp

Bằng cách submit pull request, bạn đồng ý rằng đóng góp của bạn sẽ được cấp phép theo cùng giấy phép với dự án ([Apache 2.0](LICENSE)).

Hãy nhớ: Đóng góp cho Cline không chỉ là viết code - đó là trở thành một phần của cộng đồng cùng nhau định hình tương lai của phát triển phần mềm có sự hỗ trợ của AI. Hãy cùng nhau xây dựng điều gì đó tuyệt vời! 🚀
