import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: any[] = [];

  constructor(private socket: Socket, private http: HttpClient) { }

  setAdminSocketId(socketId: any) {
    const token = localStorage.getItem('token');
    if (token !== null || token !== undefined) {
      try {
        const user: any = jwt_decode(token);
        if (user.role === 'ADMIN') {
          this.http.patch(`${environment.apiUrl}/users/update-chat-id/${user.id}`, { chat_id: socketId }).toPromise().then(response => {
            console.log(response);
          }).catch(err => {
            console.log(err);
          });
        }
      } catch (error) {
        return false;
      }
    }

  }

  getAdminSocketId() {
    return this.http.get(`${environment.apiUrl}/users/admin/admin@gmail.com/ADMIN`).toPromise();
  }

  sendMessage(message: any) {
    return this.socket.emit('private message', message);
  }

}
