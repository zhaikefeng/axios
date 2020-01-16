import Axios from './axios.js';

// let axios = Axios.create()
// axios.default.baseUrl = 'aaa'
// console.log(axios.default)
// let axios2 = Axios.create()
// console.log(axios2.default)

// let axios = Axios.create({
//     baseUrl:"aaa",
//     headers:{
//         common:{
//             aaa:112
//         }
//     }
// })
// console.log(axios.default)

// let axios2 = Axios.create({
//     baseUrl:"bbbb"
// })
// console.log(axios2.default)

// Axios('1.json');
// Axios({url:'1.json', params: { a: 12 }});
// Axios({url:'1.json', headers: { a: 213, b: 132 } });

// Axios.post('1.php');
// Axios.post('1.php', { a: 12, b: 5 });
// Axios.post('1.php', [12, 5, 6]);

// let form = new FormData();
// Axios.post('1.txt', form);
// Axios.post('1.txt', 'dw1ewdq');

// Axios('1.json', form, { headers: { a: 213, b: 132 } });

// Axios.delete('1.json');
// Axios.delete('1.json', { parmas: { id: 1 } });


// Axios('1.php');
// Axios({
//   url: '2.php',
//   params: { a: 12, b: 3 },
//   headers: {
//     a: 12,
//   },
// });
// Axios('./data/1.txt', {
//     headers: {
//       a: 12,
//     },
//     method:'get'
//   });
Axios('/data/1.txt', {
    baseUrl:'',
    headers: {
      a: 12,
    },
    method:'get'
  });