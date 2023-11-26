const SECRET_KEY = "sangat-rahasia";
let logo = {

thunderstorm: "https://i.imgur.com/rK4pVpl.png", // 2xx Thunderstorm
drizzle: "https://i.imgur.com/imVd8dd.png" ,// 3xx Drizzle
rain: "https://i.imgur.com/oqU2rAr.png", // 5xx Rain
snow: "https://i.imgur.com/1YKOgqt.png", // 6xx Snow
atmosphere: "https://i.imgur.com/3ySKAbw.png", // 7xx Atmosphere
clouds: "https://i.imgur.com/o4BgyTR.png", // 80x Clouds
clear: "https://i.imgur.com/XhlFmO6.png," // 800 Clear
}

let suggest = {

  thunderstorm: " Untuk tanaman di pot, bawa ke dalam rumah atau tempat tertutup.Untuk tanaman yang berada di tanah, bisa ditutupi dengan pot, ember, atau plastik lebar untuk melindunginya dari hujan yang lebat.", // 2xx Thunderstorm
  drizzle: "Pantau tanaman Anda untuk mencari tanda-tanda penyakit jamur yang tumbuh subur dalam kondisi lembap, seperti jamur atau hawar. Pangkas daun yang terinfeksi dan pastikan sirkulasi udara yang baik di sekitar tanaman." ,// 3xx Drizzle
  rain: "Pastikan garden beds atau wadah taman Anda memiliki drainase yang baik untuk mencegah genangan air. Menaikkan garden beds dan menambahkan bahan organik ke dalam tanah dapat meningkatkan drainase.", // 5xx Rain
  snow: "Jika salju disertai suhu yang sangat dingin, pastikan tanaman dalam ruangan Anda tidak berada di dekat jendela atau pintu yang berangin. Pindahkan tanaman ke lokasi yang mendapat penerangan cukup namun terlindung dari angin dingin.", // 6xx Snow
  atmosphere: "Menambahkan mulsa di sekitar pangkal tanaman dapat membantu melindungi tanah dari erosi akibat hujan lebat. Menutupi tanaman yang rapuh dengan kain atau penutup baris yang menyerap keringat dapat melindunginya dari kerusakan yang disebabkan oleh hujan es atau tetesan air hujan yang deras.", // 7xx Atmosphere
  clouds: "Pada cuaca berawan, tanaman masih memerlukan penyiraman. Periksa tingkat kelembaban tanah sebelum disiram. Tempelkan jari Anda ke dalam tanah; jika terasa kering sekitar satu inci di bawah permukaan, saatnya menyiram. Tutupan awan mungkin mengurangi laju penguapan, jadi sesuaikan frekuensi penyiraman", // 80x Clouds
  clear: "Untuk tanaman yang membutuhkan penyangga (seperti tomat atau mentimun), gunakan hari cerah untuk mengikatnya pada tiang atau teralis. Selain itu, pangkas daun yang mati atau rusak untuk mendorong pertumbuhan yang sehat." // 800 Clear
  }
  

module.exports = {
  SECRET_KEY,
  logo,
  suggest,
};
