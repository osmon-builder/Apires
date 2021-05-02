import { Component, OnInit } from '@angular/core';
import { UserService} from '../../Services/user.service';
import {GLOBAL} from '../../Services/global';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService]
})
export class SidebarComponent implements OnInit {
    public identity;
    public token;
    public stats;
    public url;
    public status;

  constructor(
    private _userService: UserService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    }


  ngOnInit(): void {
    console.log("side.bar cargado")
  }

}
