# Cline

<p align="center">
    <img src="https://media.githubusercontent.com/media/cline/cline/main/assets/docs/demo.gif" width="100%" />
</p>

<div align="center">
<table>
<tbody>
<td align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev" target="_blank"><strong>Tải về từ VS Marketplace</strong></a>
</td>
<td align="center">
<a href="https://discord.gg/cline" target="_blank"><strong>Discord</strong></a>
</td>
<td align="center">
<a href="https://www.reddit.com/r/cline/" target="_blank"><strong>r/cline</strong></a>
</td>
<td align="center">
<a href="https://github.com/cline/cline/discussions/categories/feature-requests?discussions_q=is%3Aopen+category%3A%22Feature+Requests%22+sort%3Atop" target="_blank"><strong>Yêu cầu tính năng</strong></a>
</td>
<td align="center">
<a href="https://docs.cline.bot/getting-started/for-new-coders" target="_blank"><strong>Hướng dẫn cho người mới</strong></a>
</td>
</tbody>
</table>
</div>

Gặp gỡ Cline — một trợ lý AI có thể sử dụng **terminal** và **editor** của bạn.

Nhờ vào [khả năng lập trình tự chủ của Claude 4 Sonnet](https://www.anthropic.com/claude/sonnet), Cline có thể xử lý từng bước các tác vụ phát triển phần mềm phức tạp. Với bộ công cụ đa dạng, Cline có thể tạo và chỉnh sửa file, duyệt qua các dự án lớn, sử dụng trình duyệt, và thực thi lệnh terminal sau khi được bạn phê duyệt, mang đến sự hỗ trợ sâu hơn nhiều so với việc chỉ hoàn thiện code hoặc hỗ trợ kỹ thuật. Cline thậm chí còn có thể sử dụng Model Context Protocol (MCP) để tạo công cụ mới và mở rộng khả năng của mình. Trong khi các script AI tự động truyền thống thường chạy trong môi trường sandbox, extension này cung cấp giao diện đồ họa (GUI) với sự tham gia của con người để xem xét và phê duyệt mọi thay đổi file và lệnh terminal, tạo ra một cách an toàn và dễ sử dụng để khám phá tiềm năng của AI tự chủ.

1. Nhập nhiệm vụ của bạn và thêm hình ảnh để chuyển đổi mockup giao diện thành ứng dụng hoạt động, hoặc sửa lỗi thông qua ảnh chụp màn hình.
2. Cline sẽ bắt đầu bằng việc phân tích cấu trúc file và cây cú pháp trừu tượng (AST) của mã nguồn, đồng thời thực hiện tìm kiếm regex và đọc các file liên quan để nhanh chóng làm quen với ngữ cảnh dự án. Bằng cách quản lý chính xác thông tin được đưa vào ngữ cảnh, Cline có thể hỗ trợ hiệu quả ngay cả với các dự án lớn và phức tạp mà không vượt quá giới hạn cửa sổ ngữ cảnh.
3. Sau khi có đủ thông tin cần thiết, Cline có thể:
   - Tạo và chỉnh sửa file, đồng thời theo dõi lỗi linter hoặc compiler trong quá trình, chủ động sửa các vấn đề như thiếu import, lỗi cú pháp, v.v.
   - Thực thi lệnh trực tiếp trong terminal của bạn và theo dõi output trong quá trình chạy, ví dụ như tự động phản hồi các vấn đề của development server sau khi sửa đổi file.
   - Đối với các tác vụ phát triển web, Cline có thể mở website trong trình duyệt headless, thực hiện click, nhập liệu, cuộn trang, và thu thập screenshot cùng console log để sửa lỗi runtime và vấn đề giao diện.
4. Khi nhiệm vụ hoàn thành, Cline sẽ trình bày kết quả cho bạn thông qua lệnh terminal như `open -a "Google Chrome" index.html`, bạn chỉ cần nhấn nút để thực thi.

> [!TIP]
> Sử dụng phím tắt `CMD/CTRL + Shift + P` để mở command palette và gõ "Cline: Open In New Tab" để mở extension dưới dạng tab trong editor. Điều này cho phép bạn sử dụng Cline song song với file explorer, dễ dàng quan sát cách Cline thay đổi workspace của bạn.

---

<img align="right" width="340" src="https://github.com/user-attachments/assets/3cf21e04-7ce9-4d22-a7b9-ba2c595e88a4">

### Sử dụng bất kỳ API và mô hình nào

Cline hỗ trợ các nhà cung cấp API như OpenRouter, Anthropic, OpenAI, Google Gemini, AWS Bedrock, Azure và GCP Vertex. Bạn cũng có thể cấu hình bất kỳ API tương thích OpenAI nào, hoặc sử dụng mô hình local thông qua LM Studio/Ollama. Nếu bạn sử dụng OpenRouter, extension sẽ lấy danh sách mô hình mới nhất của họ, cho phép bạn sử dụng ngay khi có mô hình mới.

Ngoài ra, extension còn ghi lại tổng số token và chi phí sử dụng API trong toàn bộ quy trình nhiệm vụ cũng như từng request, đảm bảo bạn luôn rõ ràng về chi phí ở mọi bước.

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="left" width="370" src="https://github.com/user-attachments/assets/81be79a8-1fdb-4028-9129-5fe055e01e76">

### Chạy lệnh trong terminal

Nhờ vào [bản cập nhật tích hợp terminal shell mới](https://code.visualstudio.com/updates/v1_93#_terminal-shell-integration-api) trong VSCode v1.93, Cline có thể thực thi lệnh trực tiếp trong terminal của bạn và nhận output. Điều này cho phép Cline thực hiện nhiều tác vụ đa dạng, từ cài đặt package và chạy build script đến triển khai ứng dụng, quản lý database và thực thi test, đồng thời thích nghi với môi trường phát triển và toolchain của bạn để hoàn thành công việc đúng cách.

Đối với các tiến trình chạy lâu như development server, sử dụng nút "Tiếp tục khi đang chạy" để Cline tiếp tục nhiệm vụ trong khi lệnh chạy ở background. Khi Cline làm việc, anh ấy sẽ nhận thông báo về bất kỳ output terminal mới nào trong quá trình, cho phép phản ứng với các vấn đề có thể phát sinh, ví dụ như lỗi compile-time khi chỉnh sửa file.

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="right" width="400" src="https://github.com/user-attachments/assets/c5977833-d9b8-491e-90f9-05f9cd38c588">

### Tạo và chỉnh sửa file

Cline có thể tạo và chỉnh sửa file trực tiếp trong editor của bạn, hiển thị cho bạn diff view của các thay đổi. Bạn có thể chỉnh sửa hoặc hoàn tác các thay đổi của Cline trực tiếp trong diff view editor, hoặc cung cấp phản hồi trong chat cho đến khi bạn hài lòng với kết quả. Cline cũng theo dõi lỗi linter/compiler (thiếu import, lỗi cú pháp, v.v.) để có thể tự sửa các vấn đề phát sinh trong quá trình.

Tất cả các thay đổi mà Cline thực hiện đều được ghi lại trong timeline của file, cung cấp cách dễ dàng để theo dõi và hoàn tác các sửa đổi (nếu cần).

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="left" width="370" src="https://github.com/user-attachments/assets/bc2e85ba-dfeb-4fe6-9942-7cfc4703cbe5">

### Sử dụng trình duyệt

Nhờ tính năng [computer use](https://www.anthropic.com/news/3-5-models-and-computer-use) mới của Claude 4 Sonnet, Cline có thể khởi chạy trình duyệt, click vào các phần tử, nhập văn bản và cuộn trang, chụp screenshot và console log ở mỗi bước. Điều này cho phép debug tương tác, kiểm thử end-to-end, và thậm chí là sử dụng web nói chung! Nhờ đó, Cline có thể tự động sửa lỗi giao diện và vấn đề runtime mà không cần bạn phải thao tác thủ công và copy-paste log lỗi.

Thử yêu cầu Cline "kiểm tra ứng dụng", xem cách anh ấy chạy lệnh `npm run dev`, khởi động development server đang chạy local trong trình duyệt, và thực hiện một loạt kiểm tra để xác nhận mọi thứ hoạt động bình thường. [Xem demo tại đây.](https://x.com/sdrzn/status/1850880547825823989)

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="right" width="350" src="https://github.com/user-attachments/assets/ac0efa14-5c1f-4c26-a42d-9d7c56f5fadd">

### "Thêm một công cụ..."

Nhờ [Model Context Protocol](https://github.com/modelcontextprotocol), Cline có thể mở rộng khả năng của mình bằng các công cụ tùy chỉnh. Trong khi bạn có thể sử dụng [các server do cộng đồng tạo](https://github.com/modelcontextprotocol/servers), Cline có thể tạo và cài đặt các công cụ phù hợp với quy trình làm việc cụ thể của bạn. Chỉ cần yêu cầu Cline "thêm một công cụ", anh ấy sẽ xử lý mọi thứ, từ việc tạo MCP server mới đến cài đặt nó vào extension. Các công cụ tùy chỉnh này sẽ trở thành một phần trong bộ công cụ của Cline, sẵn sàng sử dụng cho các nhiệm vụ trong tương lai.

- "Thêm công cụ lấy ticket Jira": Truy xuất acceptance criteria và để Cline bắt đầu làm việc
- "Thêm công cụ quản lý AWS EC2": Kiểm tra metrics server và scale instance lên xuống
- "Thêm công cụ lấy sự kiện PagerDuty mới nhất": Lấy chi tiết và để Cline sửa lỗi

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="left" width="360" src="https://github.com/user-attachments/assets/7fdf41e6-281a-4b4b-ac19-020b838b6970">

### Thêm ngữ cảnh

**`@url`:** Dán URL để extension tải và chuyển đổi sang markdown, rất hữu ích khi bạn muốn cung cấp tài liệu mới nhất cho Cline

**`@problems`:** Thêm lỗi và cảnh báo workspace (bảng "Problems") để Cline sửa

**`@file`:** Thêm nội dung file, giúp bạn không phải lãng phí API request để phê duyệt đọc file (+ nhấn để tìm kiếm file)

**`@folder`:** Thêm các file của thư mục cùng lúc, giúp tăng tốc quy trình làm việc của bạn

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

<img align="right" width="350" src="https://github.com/user-attachments/assets/140c8606-d3bf-41b9-9a1f-4dbf0d4c90cb">

### Checkpoint: So sánh và khôi phục

Khi Cline hoàn thành nhiệm vụ, extension sẽ chụp snapshot workspace của bạn ở mỗi bước. Bạn có thể sử dụng nút "So sánh" để xem sự khác biệt giữa snapshot và workspace hiện tại, và sử dụng nút "Khôi phục" để quay lại điểm đó.

Ví dụ, khi sử dụng local web server, bạn có thể dùng "Chỉ khôi phục workspace" để nhanh chóng kiểm tra các phiên bản khác nhau của ứng dụng, sau đó sử dụng "Khôi phục nhiệm vụ và workspace" khi tìm được phiên bản muốn tiếp tục phát triển. Điều này cho phép bạn khám phá các cách tiếp cận khác nhau một cách an toàn mà không mất tiến độ.

<!-- Transparent pixel to create line break after floating image -->

<img width="2000" height="0" src="https://github.com/user-attachments/assets/ee14e6f7-20b8-4391-9091-8e8e25561929"><br>

## Đóng góp

Để đóng góp cho dự án, hãy bắt đầu từ [hướng dẫn đóng góp](CONTRIBUTING.md) của chúng tôi để tìm hiểu những điều cơ bản. Bạn cũng có thể tham gia [Discord](https://discord.gg/cline) của chúng tôi để trò chuyện với các contributor khác trong kênh `#contributors`. Nếu bạn đang tìm kiếm công việc toàn thời gian, hãy xem các vị trí đang tuyển dụng trên [trang tuyển dụng](https://cline.bot/join-us) của chúng tôi!

<details>
<summary>Hướng dẫn phát triển local</summary>

1. Clone repository _(yêu cầu [git-lfs](https://git-lfs.com/))_:
        ```bash
        git clone https://github.com/cline/cline.git
        ```
2. Mở dự án trong VSCode:
        ```bash
        code cline
        ```
3. Cài đặt các dependency cần thiết cho extension và webview-gui:
        ```bash
        npm run install:all
        ```
4. Nhấn `F5` (hoặc `Run`->`Start Debugging`) để mở một cửa sổ VSCode mới với extension đã được load. (Nếu bạn gặp vấn đề khi build dự án, có thể bạn cần cài đặt [esbuild problem matchers extension](https://marketplace.visualstudio.com/items?itemName=connor4312.esbuild-problem-matchers))

</details>

## Giấy phép

[Apache 2.0 © 2025 Cline Bot Inc.](./LICENSE)
