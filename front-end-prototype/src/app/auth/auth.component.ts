import { Component, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { sha256 } from 'js-sha256';
import WebApp from '@twa-dev/sdk';



@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  TOKEN = '7917483032:AAHZv1gfmyr8onZvh-Lfto3_osAELQPnoG8'
  lp: string = 'empty';

  constructor(private route: ActivatedRoute) {
    // validate();
    WebApp.ready();
    // this._validate();
    this.__validate();
  }

  __validate() {
    const data = WebApp.initData
      .split('&') // split by &
      .sort() // sort by key
      .map((item) => {
        const [key, value] = item.split('='); // split by =
        return { [key]: (value) } // return object
      })
      .reduce((acc, item) => ({ ...acc, ...item }), {}); // merge all

    const hash = data['hash']; // save hash

    delete data['hash']; // remove hash

    console.log("data: ", data);

    const data_check_string = Object.keys(data).map(key => `${key}=<${data[key]}>`).join('\n')

    console.log(data_check_string);


    const secretKey = sha256.hmac("WebAppData", this.TOKEN);
    const _hash = sha256.hex(sha256.hmac(secretKey, data_check_string));

    // const secretKey = sha256.hmac("WebAppData", this.TOKEN);
    // const _hash = (sha256.hmac(secretKey, data_check_string));

    console.log('hash:', hash);
    console.log('_hash:', _hash);



  }

  _validate() {
    try {
      // const launchParams = retrieveLaunchParams(); NON VA
      const window_hash = window.location.hash.slice(1);
      console.log(window_hash);
      /*
      tgWebAppData=query_id=AAHlPQEUAAAAAOU9ARREeV-D&
      user=%257B%2522id%2522%253A335625701%252C%2522first_name%2522%253A%2522Francesco%2522%252C%2522last_name%2522%253A%2522Naletto%2522%252C%2522username%2522%253A%2522Hisukurifu%2522%252C%2522language_code%2522%253A%2522it%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D&
      auth_date=1729503609&
      hash=bd47a1142c252ccba58b33edbac7c5a07d8b30197aa8bc97e7bf518062b36070&
      tgWebAppVersion=7.10&
      tgWebAppPlatform=tdesktop&
      tgWebAppThemeParams= ...
      */
      const data = window_hash.
        split('&') // split by &
        .sort() // sort by key
        .map((item) => {
          const [key, value] = item.split('='); // split by =
          return { [key]: (value) } // return object
        })
        .reduce((acc, item) => ({ ...acc, ...item }), {}); // merge all

      const hash = data['hash']; // save hash

      delete data['hash']; // remove hash

      // Object.keys(data).sort();
      console.log(data);

      // Data-check-string is a concatenation of all received fields,
      // sorted in alphabetical order, in the format key = <value> with a line feed character('\n', 0x0A) used as separator
      // – e.g., 'auth_date=<auth_date>\nfirst_name=<first_name>\nid=<id>\nusername=<username>'.
      const data_check_string = Object.keys(data).map(key => `${key}=${data[key]}`).join('\n')

      console.log("data c s", data_check_string);


      const secretKey = sha256(this.TOKEN);
      const _hash = sha256.hex(sha256.hmac(secretKey, data_check_string));

      // const secretKey = sha256.hmac("WebAppData", this.TOKEN);
      // const _hash = (sha256.hmac(secretKey, data_check_string));

      console.log('hash:', hash);
      console.log('_hash:', _hash);





    } catch (error) {
      console.error(error);
    }


  }

  validate_my() {
    const data = {
      auth_date: this.route.snapshot.queryParamMap.get('auth_date')!,
      first_name: this.route.snapshot.queryParamMap.get('first_name')!,
      id: this.route.snapshot.queryParamMap.get('id')!,
      last_name: this.route.snapshot.queryParamMap.get('last_name')!,
      photo_url: this.route.snapshot.queryParamMap.get('photo_url')!,
      username: this.route.snapshot.queryParamMap.get('username')!,
    }
    const hash = this.route.snapshot.queryParamMap.get('hash')!;

    if (!data['auth_date'] || !data['first_name'] || !data['id'] || !data['last_name'] || !data['photo_url'] || !data['username'] || !hash) {
      throw new Error('Authorization data is incomplete');
    }

    // if ((new Date().getTime() - new Date(data['auth_date']).getTime()) > 86400000) { // milisecond
    //   throw new Error('Authorization data is outdated');
    // }

    // Data-check-string is a concatenation of all received fields, 
    // sorted in alphabetical order, in the format key = <value> with a line feed character('\n', 0x0A) used as separator 
    // – e.g., 'auth_date=<auth_date>\nfirst_name=<first_name>\nid=<id>\nusername=<username>'.
    const data_check_string = Object.keys(data).sort().map(key => `${key}=${(data as { [key: string]: string })[key]}`).join('\n')

    console.log(data_check_string);

    // const secretKey = crypto.createHmac("sha256", "WebAppData").update(this.TOKEN).digest();
    // const _hash = crypto.createHmac("sha256", secretKey).update(data_check_string).digest("hex");

    // console.log('hash_:', _hash)
    console.log('hash:', hash)
  }
} 
