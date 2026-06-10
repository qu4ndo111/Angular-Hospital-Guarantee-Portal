import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Popover } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { TranslocoModule } from '@jsverse/transloco';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warn' | 'error';
  read: boolean;
  icon: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, Popover, BadgeModule, TranslocoModule],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification implements OnInit {
  notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Hệ thống bảo trì',
      description: 'Hệ thống sẽ tạm ngưng để bảo trì định kỳ vào lúc 23:00 tối nay trong khoảng 30 phút.',
      time: '10 phút trước',
      type: 'warn',
      icon: 'pi pi-exclamation-triangle',
      read: false
    },
    {
      id: '2',
      title: 'Báo cáo doanh thu',
      description: 'Báo cáo phân tích doanh thu tháng 5 đã được phê duyệt và xuất bản.',
      time: '1 giờ trước',
      type: 'success',
      icon: 'pi pi-check-circle',
      read: false
    },
    {
      id: '3',
      title: 'Thiết bị đăng nhập mới',
      description: 'Tài khoản của bạn đã được đăng nhập từ một thiết bị chạy Windows tại Hà Nội.',
      time: '5 giờ trước',
      type: 'info',
      icon: 'pi pi-desktop',
      read: true
    },
    {
      id: '4',
      title: 'Yêu cầu hỗ trợ',
      description: 'Yêu cầu hỗ trợ mã số #8492 đã được nhân viên phản hồi.',
      time: '1 ngày trước',
      type: 'info',
      icon: 'pi pi-envelope',
      read: true
    },
    {
      id: '5',
      title: 'Lỗi đồng bộ dữ liệu',
      description: 'Không thể đồng bộ dữ liệu với máy chủ lưu trữ dự phòng. Vui lòng kiểm tra kết nối.',
      time: '2 ngày trước',
      type: 'error',
      icon: 'pi pi-times-circle',
      read: true
    }
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  ngOnInit(): void {}

  markAsRead(item: NotificationItem): void {
    item.read = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  clearAll(event: Event): void {
    event.stopPropagation();
    this.notifications = [];
  }
}
