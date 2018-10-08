import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class ConfigService {

  private config: Object = null;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {}

  public getConfig(key: any) {
      return this.config[key];
  }

  public load() {
    return new Promise((resolve, reject) => {
      let file = decodeURIComponent(this.activatedRoute.snapshot.queryParams['config']);
      if (file === 'undefined') {
        file = 'assets/config.json';
      }
      this.http.get(file)
        .subscribe((responseData) => {
          this.config = responseData;
          console.log('we have the config data!', this.config);
          resolve(true);
        });
    });
  }
}
