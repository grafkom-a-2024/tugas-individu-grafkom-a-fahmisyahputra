**TUGAS 3**
**Muhammad Fahmi Syahputra - 5025221302**

*Membuat beberapa objek 3D berbagai bentuk Dasar geometri (Cube,
Cylinder, Cone)*<br>
Pertama, saya buat objek 3D berupa Cube/Kubus, dengan mendefinisikan posisi titik/vertices dan indeks nya untuk menggambar tiap sisi kubus. Kubus dirender dengan rotasi otomatis di sekitar beberapa sumbu (X, Y, Z) agar memperlihatkan semua sisinya, dan setiap sisi kubus diberi warna berbeda untuk dapat membedakan setiap sisinya. 
<br>
<br>
Lalu saya membuat dua objek lagi, yaitu Silinder 3D dan Kerucut/Cone 3D, disini kedua objek tersebut saya tambahkan sedikit pencahayaan sederhana (shading) dan saya buat objeknya berputar secara otomatis di sekitar sumbu X, Y, dan Z agar terlihat kedua objek nya merupakan objek 3D.
<br>
<br>
Hasil Kubus : <br>
<img width="752" alt="Screenshot 2024-09-22 at 21 49 07" src="https://github.com/user-attachments/assets/d0738bb6-c034-4803-bac6-f06d45572cf9">
<br>
Hasil Silinder dan Kerucut/Cone : <br>
<img width="750" alt="Screenshot 2024-09-22 at 21 50 21" src="https://github.com/user-attachments/assets/668a2e8f-6c9a-466e-9c3b-520bca2d32eb">
<br>
<br>

*Membuat objek 3D Geometry - Lathe*<br>
Untuk objek 3D Lathe, disini saya membuat objek gasing, karena bentuk gasing bisa kita ambil seperti sebuah kurva atau profil 2D dan memutarnya di sekitar sumbu (sumbu Y) untuk membentuk objek 3D. Berikut merupakan profil 2D untuk gasing yang nanti akan diputar profil 2D ini dengan sejumlah segmen radial untuk membentuk permukaan vas bunga. Objek gasing ini juga saya putar/rotasikan agar terlihat bahwa ini objek 3D.
<br>
<img width="329" alt="Screenshot 2024-09-22 at 21 51 31" src="https://github.com/user-attachments/assets/2201abf2-c4af-40b2-9c55-788d4c237aa2">
<br>
<br>
Hasil objek lathe gasing : <br>
<img width="750" alt="Screenshot 2024-09-22 at 21 53 08" src="https://github.com/user-attachments/assets/ebc53112-752b-4290-b0b0-8bacc90d9394">
<br>

*Menerapkan Texture*<br>
Disini saya menerapkan tekstur pada kubus 3D dengan cara memetakan gambar texture ke setiap permukaan kubus.Yaitu dengan membuat buffer textureCoordBuffer yang menyimpan koordinat tekstur untuk setiap vertex pada kubus. Lalu menggunakan fungsi loadTexture untuk memuat gambar tekstur (texture.jpg) secara asinkron dan menerapkannya pada objek nya. Lalu dalam shader fragment, saya gunakan fungsi texture2D untuk mengambil sampel warna dari tekstur berdasarkan koordinat tekstur yang diberikan, sehingga tekstur akan muncul pada permukaan kubus (saya menggunakan gambar logo Real Madrid, dan saya simpan sebagai texture.jpg). Beirkut adalah hasil texture pada permukaan kubus nya :
<br>
<img width="751" alt="Screenshot 2024-09-22 at 21 54 27" src="https://github.com/user-attachments/assets/0d70c2ff-2b2c-41d8-a80e-a67cc13a578f">
<br>
<img width="751" alt="Screenshot 2024-09-22 at 21 55 21" src="https://github.com/user-attachments/assets/4bf9d44f-7eb7-41e7-b8b9-7b0f4b03cca2">
<br>

*Menerapkan Lighting*<br>
Disini saya berikan efek lighting/pencahayaan dengan menggunakan model pencahayaan directional light. Yaitu dengan menambahkan atribut aVertexNormal untuk setiap vertex, yang merepresentasikan normal pada titik tersebut. Dan dalam shader vertex, kita hitung efek pencahayaan dengan melakukan dot product antara normal tertransformasi dan arah cahaya. Nilai ini yang menentukan intensitas cahaya pada permukaan kubus nya. Berikut adalah hasil dari lighting ke objek kubus :
<br>
<img width="751" alt="Screenshot 2024-09-22 at 21 57 51" src="https://github.com/user-attachments/assets/e1f7fc45-1ce9-41d8-b8dc-0f8bc1530937">
<br>

*Animasi (rotasi, translasi, scaling)*<br>
Pada animasi, saya menambahkan kontrol animasi yang memungkinkan pengguna untuk berinteraksi dengan kubus nya. Seperti Rotasi, Translasi, dan Scaling. Untuk rotasi, saya terapkan dengan menggunakan tombol panah pada keyboard untuk memutar kubus di sekitar sumbu X dan Y. Rotasi ini diimplementasikan dengan mengubah matriks model (modelMatrix) menggunakan fungsi mat4.rotateX dan mat4.rotateY. Lalu untuk translasi dapat dengan tombol W/A/S/D dan disini juga diimplementasikan dengan mengubah matriks model (modelMatrix), namun dengan fungsi mat4.translate. Kemudian untuk Scaling, dengan menggunakan tombol Q dan E untuk memperbesar atau memperkecil ukuran kubus nya. Perubahan skala nya diterapkan pada matriks model dengan fungsi mat4.scale.
<br>
Hasil rotasi dengan panah keyboard atas/bawah/kanan/kiri :<br>
<img width="750" alt="Screenshot 2024-09-22 at 22 01 52" src="https://github.com/user-attachments/assets/238cd66d-fe51-415a-8bea-6c903162891c">
<br>
Translasi ke kanan dengan keyboard W/A/S/D : <br>
<img width="753" alt="Screenshot 2024-09-22 at 22 02 27" src="https://github.com/user-attachments/assets/184680b3-79a5-4efe-8270-163c100782ed">
<br>
Scaling menjadi lebih kecil (keyboard Q untuk memperbesar, E untuk memperkecil) : 
<br>
<img width="752" alt="Screenshot 2024-09-22 at 22 03 02" src="https://github.com/user-attachments/assets/62e692da-cd10-4ad4-9e7d-bbbd40e2055e">
<br>

*Orthographic, perspective camera*<br>
Pada proyeksi perspective yang mana mensimulasikan cara mata manusia melihat dunia, sehingga objek yang lebih jauh tampak lebih kecil. Disini saya implementasikan dengan fungsi mat4.perspective untuk membuat matriks proyeksi perspektif. Lalu untuk proyeksi ortografis artinya menampilkan objek tanpa distorsi perspektif; sehingga ukuran objek tetap konstan terlepas dari jaraknya. Disini saya terapkan dengan fungsi mat4.ortho untuk membuat matriks proyeksi ortografis. Dan disini saya buat agar pengguna dapat menekan tombol P pada keyboard untuk beralih antara proyeksi perspektif dan ortografis. Dan untuk perspektif kamera, dapat menekan tombol J untuk rotasi kamera ke kiri mengelilingi objek, dan tombol L untuk rotasi kamera ke kanan mengelilingi objek. Dan juga dapat mendekat/menjauh dari objek, dengan menekan tombol I untuk Zoom in (mendekat ke objek), dan K untuk Zoom out (menjauh dari objek).
<br>
Hasil perspektif kamera ke kanan mengelilingi objek : <br>
<img width="749" alt="Screenshot 2024-09-22 at 22 04 01" src="https://github.com/user-attachments/assets/ce1c669b-f8ed-4c8a-88fb-bfe1067d475a">
<br>
Hasil perspektif kamera Zoom in (mendekat ke objek) :  <br>
<img width="751" alt="Screenshot 2024-09-22 at 22 04 48" src="https://github.com/user-attachments/assets/a48f6043-5de6-4ac4-8613-ac66ff738b19">
<br>
Setelah menekan tombol P untuk proyeksi ortografis, objek 3D seperti kubus akan tampak 2D karena semua sudut pandangnya sejajar dan tidak ada efek perspektif. Ini berarti ukuran objek tidak berubah meskipun jarak dari kamera berbeda, sehingga tidak ada distorsi perspektif dalam menampilkan objek nya : <br>
<img width="748" alt="Screenshot 2024-09-22 at 22 05 33" src="https://github.com/user-attachments/assets/3eabea7a-3f4c-4d7e-bc16-cc7a35d40756">
<br>



















