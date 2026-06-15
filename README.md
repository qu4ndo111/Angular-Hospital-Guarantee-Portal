# Hospital Guarantee Management Portal

A web application for managing hospital insurance guarantee requests, built with Angular 20 and PrimeNG.

Live demo: [angular-hospital-guarantee-portal](https://angular-hospital-guarantee-portal.vercel.app/)

Login credentials:

```
Email:    admin@admin.com
Password: Admin@123
```
---

## What this project demonstrates

- Multi-step form for submitting guarantee requests
- List view with search, filter by status/hospital/treatment type
- Detail page showing approval timeline and workflow stages
- Six-stage status workflow: Draft → Submitted → Reviewing → Approved / Rejected → Paid
- Responsive layout with dark and light theme
- Bilingual interface: English and Vietnamese
- **Reports & Analytics Dashboard**: Monthly reports and hospital performance metrics (SLA, average processing time, claimed/assessed amounts)
- **Advanced Filtering**: Filter reports by date range and treatment type (Inpatient, Outpatient, Surgery, Emergency)
- **CSV Data Export**: Download report datasets as CSV files for further offline analysis

---

## Tech stack

- Angular 20 (standalone components)
- PrimeNG 20
- RxJS
- Transloco (i18n)
- TypeScript
- TailwindCSS

---

## Getting started

```bash
npm install
npm start
```

Open http://localhost:4200

Login credentials:

```
Email:    admin@admin.com
Password: Admin@123
```

---

## Project structure

```
src/app/
├── core/               Guards, global services, menu config
├── features/
│   ├── auth/           Login, register, forgot password
│   ├── dashboard/      Stats overview
│   ├── guarantee/      Main feature: list, form, detail
│   └── reports/        Reporting & performance analytics (monthly reports, hospital performance)
├── layouts/            Main layout and auth layout
└── shared/
    ├── components/     Header, sidebar, footer
    ├── ui/             Reusable UI wrappers (button, table, card)
    └── services/       Toast, confirm dialog, loading
```

---

## Key commands

```bash
npm start           Start dev server
npm run build       Production build
ng g c <name>       Generate component
ng g s <name>       Generate service
```

---

## Business context

This project is a simplified version of a hospital guarantee management system used in insurance operations. Hospital partners submit guarantee requests digitally, and insurance reviewers approve or reject them based on contract terms. The goal is to reduce manual processing time by automating the approval workflow.

---

## Notes

- Authentication is mocked. Replace `auth.service.ts` with your real API when integrating a backend.
- All data is stored in memory using Angular signals. Replace with HTTP calls as needed.
- Menu items are configured in `core/config/menu.ts`.
- Theme colors are in `src/styles.scss` under `:root`.

---

*Built as a portfolio project. Simplified version of a real insurance platform.*

---

---

# Cổng thông tin bảo lãnh viện phí

Ứng dụng web quản lý yêu cầu bảo lãnh viện phí cho các bệnh viện đối tác, xây dựng bằng Angular 20 và PrimeNG.

Demo trực tuyến: [angular-hospital-guarantee-portal](https://angular-hospital-guarantee-portal.vercel.app/)

Thông tin đăng nhập:

```
Email:    admin@admin.com
Password: Admin@123
```
---

## Tính năng

- Form nhiều bước để gửi yêu cầu bảo lãnh
- Danh sách hồ sơ với tìm kiếm và lọc theo trạng thái, bệnh viện, loại điều trị
- Trang chi tiết hiển thị lịch sử duyệt và các bước xử lý
- Quy trình 6 trạng thái: Nháp → Đã gửi → Đang xét duyệt → Duyệt / Từ chối → Đã thanh toán
- Giao diện sáng / tối, hỗ trợ tiếng Anh và tiếng Việt
- **Báo cáo & Thống kê số liệu**: Báo cáo theo tháng và đo lường hiệu suất bệnh viện (chỉ số SLA, thời gian xử lý trung bình, số tiền yêu cầu/duyệt chi)
- **Bộ lọc nâng cao**: Lọc báo cáo linh hoạt theo khoảng thời gian và loại điều trị (Nội trú, Ngoại trú, Phẫu thuật, Cấp cứu)
- **Xuất file dữ liệu CSV**: Hỗ trợ tải xuống báo cáo dưới định dạng CSV để lưu trữ và phân tích thêm

---

## Công nghệ

- Angular 20 (standalone components)
- PrimeNG 20
- RxJS
- Transloco (đa ngôn ngữ)
- TypeScript
- TailwindCSS

---

## Chạy dự án

```bash
npm install
npm start
```

Truy cập http://localhost:4200

Thông tin đăng nhập:

```
Email:    admin@admin.com
Password: Admin@123
```

---

## Cấu trúc thư mục

```
src/app/
├── core/               Guards, service toàn cục, cấu hình menu
├── features/
│   ├── auth/           Đăng nhập, đăng ký, quên mật khẩu
│   ├── dashboard/      Tổng quan thống kê
│   ├── guarantee/      Tính năng chính: danh sách, form, chi tiết
│   └── reports/        Báo cáo & thống kê hiệu suất (theo tháng và theo bệnh viện)
├── layouts/            Layout chính và layout xác thực
└── shared/
    ├── components/     Header, sidebar, footer
    ├── ui/             Component tái sử dụng (button, table, card)
    └── services/       Toast, hộp thoại xác nhận, loading
```

---

## Lệnh thường dùng

```bash
npm start           Chạy môi trường phát triển
npm run build       Build production
ng g c <name>       Tạo component
ng g s <name>       Tạo service
```

---

## Bối cảnh nghiệp vụ

Dự án này là phiên bản đơn giản hóa của hệ thống bảo lãnh viện phí thực tế trong lĩnh vực bảo hiểm. Các bệnh viện đối tác gửi yêu cầu bảo lãnh trực tuyến, nhân viên bảo hiểm xét duyệt và phê duyệt hoặc từ chối dựa trên điều khoản hợp đồng. Mục tiêu là giảm thời gian xử lý thủ công bằng cách tự động hóa quy trình phê duyệt.

---

## Lưu ý

- Xác thực đang dùng dữ liệu giả. Thay `auth.service.ts` bằng API thực khi tích hợp backend.
- Toàn bộ dữ liệu lưu trong bộ nhớ bằng Angular signals. Thay bằng HTTP call khi cần.
- Menu được cấu hình trong `core/config/menu.ts`.
- Màu sắc theme trong `src/styles.scss` phần `:root`.

---

*Dự án portfolio. Phiên bản đơn giản hóa từ hệ thống bảo hiểm thực tế.*
