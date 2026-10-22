// El 'hall of fame' (marcador/hall-of-fame): al acabar una partida a uno, tras
// 'GAME OVER', si los puntos entran entre los 10 mejores guardados en el
// navegador se pide el nombre del jugador (con el teclado o, en el móvil, con
// un teclado de letras dibujado en el juego) y se guarda con los puntos y la
// oleada alcanzada; luego se muestra la tabla con los 10 mejores (puesto,
// nombre, oleada y puntos) y una tecla o un toque vuelve a 'START GAME'.
// Partida lo abre (KF.partida.estado 'fama') y lo cierra irAInicio. El
// nombre viene escrito con el del perfil de jugador (js/perfiles.js).
// El mismo teclado pide el nombre de un perfil nuevo desde el menú de inicio
// (abrirPerfil); Escape lo cancela.
KF.salonFama = {
  MAXIMO: 10,              // puestos de la tabla
  LARGO_NOMBRE: 8,         // caracteres del nombre como mucho
  NOMBRE_VACIO: 'PLAYER',  // el nombre si se confirma sin escribir nada
  CLAVE: 'killerflies.salonFama',
  CLAVE_NOMBRE: 'killerflies.salonFama.ultimoNombre',
  ESPERA: 0.5,             // segundos de tabla antes de atender teclas y toques
  PERMITIDOS: /^[A-Z0-9 ]$/, // lo que tiene la fuente del juego para un nombre
  COLOR_TITULO: '#ffff40',
  COLOR_TEXTO: '#ffffff',
  COLOR_GRIS: '#808080',
  COLOR_NUEVO: '#ffff40',
  // Teclado en pantalla (en el móvil): filas de teclas; las de más de una
  // letra ocupan varias casillas.
  TECLADO: [
    'ABCDEFGHIJ',
    'KLMNOPQRST',
    'UVWXYZ0123',
    '456789'
  ],
  TECLAS_ESPECIALES: ['SPACE', 'DEL', 'END'],
  CASILLA: 20,             // lado de cada tecla, en píxeles lógicos
  ALTO_TECLADO: 150,       // borde superior del teclado en pantalla

  fase: null,              // null (cerrado) | 'nombre' | 'tabla'
  perfil: false,           // el nombre es el de un perfil nuevo, no el de la tabla
  nombre: '',
  puntos: 0,
  oleada: 1,
  nueva: -1,               // puesto (0-9) de la entrada nueva en la tabla, o -1
  tiempo: 0,               // segundos desde que se abrió la fase en curso

  // Tabla guardada, de más a menos puntos: [{ nombre, oleada, puntos }, …].
  // Lo que no tenga sentido se ignora.
  lista: function () {
    var datos;
    try {
      datos = JSON.parse(window.localStorage.getItem(this.CLAVE));
    } catch (e) {
      datos = null;
    }
    if (!Array.isArray(datos)) return [];
    var lista = [];
    for (var i = 0; i < datos.length; i++) {
      var d = datos[i];
      if (!d || typeof d.nombre !== 'string' || typeof d.puntos !== 'number' || typeof d.oleada !== 'number') continue;
      if (!(d.puntos >= 0) || !(d.oleada >= 1)) continue;
      lista.push({ nombre: this.limpiar(d.nombre) || this.NOMBRE_VACIO, oleada: Math.floor(d.oleada), puntos: Math.floor(d.puntos) });
    }
    lista.sort(function (a, b) { return b.puntos - a.puntos; });
    return lista.slice(0, this.MAXIMO);
  },

  // Un nombre con solo los caracteres de la fuente, en mayúsculas y recortado.
  limpiar: function (texto) {
    var nombre = '';
    texto = String(texto).toUpperCase();
    for (var i = 0; i < texto.length && nombre.length < this.LARGO_NOMBRE; i++) {
      if (this.PERMITIDOS.test(texto[i])) nombre += texto[i];
    }
    return nombre.trim();
  },

  // Esos puntos entran en la tabla: más de 0 y, con la tabla llena, más que el
  // último (a igualdad se queda el que ya estaba).
  entra: function (puntos) {
    var lista = this.lista();
    return puntos > 0 && (lista.length < this.MAXIMO || puntos > lista[lista.length - 1].puntos);
  },

  // Al acabar la partida: pide el nombre si los puntos entran en la tabla y,
  // si no, la muestra.
  abrir: function (puntos, oleada) {
    this.puntos = puntos;
    this.oleada = oleada;
    this.nueva = -1;
    this.tiempo = 0;
    this.perfil = false;
    if (this.entra(puntos)) {
      this.fase = 'nombre';
      this.nombre = this.limpiar(KF.perfiles.nombre());
    } else {
      this.fase = 'tabla';
    }
  },

  // Desde el menú de inicio: pide el nombre de un perfil nuevo.
  abrirPerfil: function () {
    this.perfil = true;
    this.fase = 'nombre';
    this.nombre = '';
    this.tiempo = 0;
  },

  // El último nombre escrito, para no tener que repetirlo.
  ultimoNombre: function () {
    try {
      return this.limpiar(window.localStorage.getItem(this.CLAVE_NOMBRE) || '');
    } catch (e) {
      return '';
    }
  },

  // Guarda el nombre escrito con los puntos y la oleada y pasa a la tabla.
  confirmar: function () {
    if (this.perfil) {
      KF.perfiles.crear(this.limpiar(this.nombre));
      this.cerrar();
      return;
    }
    var nombre = this.limpiar(this.nombre) || this.NOMBRE_VACIO;
    var lista = this.lista(), puesto = 0;
    while (puesto < lista.length && lista[puesto].puntos >= this.puntos) puesto++;
    lista.splice(puesto, 0, { nombre: nombre, oleada: this.oleada, puntos: this.puntos });
    lista = lista.slice(0, this.MAXIMO);
    try {
      window.localStorage.setItem(this.CLAVE, JSON.stringify(lista));
      window.localStorage.setItem(this.CLAVE_NOMBRE, nombre);
    } catch (e) { /* sin almacenamiento: la tabla dura solo esta vez */ }
    this.guardada = lista;
    this.nueva = puesto;
    this.fase = 'tabla';
    this.tiempo = 0;
  },

  // Tabla a mostrar: la recién guardada (por si no hay almacenamiento) o la
  // del navegador.
  tabla: function () {
    return this.nueva >= 0 && this.guardada ? this.guardada : this.lista();
  },

  cerrar: function () {
    this.fase = null;
    this.perfil = false;
    this.guardada = null;
    KF.partida.irAInicio();
  },

  // Una tecla (o una tecla del teclado en pantalla: 'SPACE', 'DEL', 'END' o
  // un carácter) mientras se escribe el nombre.
  escribir: function (tecla) {
    if (tecla === 'END') this.confirmar();
    else if (tecla === 'DEL') this.nombre = this.nombre.slice(0, -1);
    else {
      var c = tecla === 'SPACE' ? ' ' : tecla;
      // Sin espacios al principio ni dos seguidos.
      if (c === ' ' && (!this.nombre || this.nombre[this.nombre.length - 1] === ' ')) return;
      if (this.nombre.length < this.LARGO_NOMBRE && this.PERMITIDOS.test(c)) this.nombre += c;
    }
  },

  // Tecla del teclado físico (keydown).
  tecla: function (e) {
    if (this.fase === 'nombre') {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') this.escribir('END');
      else if (e.code === 'Backspace') this.escribir('DEL');
      else if (e.code === 'Escape' && this.perfil) this.cerrar();
      else if (e.key && e.key.length === 1) this.escribir(e.key.toUpperCase() === ' ' ? 'SPACE' : e.key.toUpperCase());
      if (e.preventDefault) e.preventDefault();
    } else if (this.fase === 'tabla' && this.tiempo >= this.ESPERA) {
      this.cerrar();
    }
  },

  // Pulsación corta en el punto p de la pantalla lógica.
  toque: function (p) {
    if (this.fase === 'nombre') {
      var t = p && this.teclaEn(p);
      if (t) this.escribir(t);
    } else if (this.fase === 'tabla' && this.tiempo >= this.ESPERA) {
      this.cerrar();
    }
  },

  // Teclas del teclado en pantalla con su rectángulo: [{ tecla, x, y, ancho, alto }].
  teclas: function () {
    var c = this.CASILLA, filas = this.TECLADO, teclas = [];
    var x0 = (KF.ANCHO - 10 * c) / 2, y = this.ALTO_TECLADO;
    for (var f = 0; f < filas.length; f++, y += c) {
      for (var i = 0; i < filas[f].length; i++) teclas.push({ tecla: filas[f][i], x: x0 + i * c, y: y, ancho: c, alto: c });
    }
    // La última fila, tras las cifras: SPACE (4 casillas), DEL y END (3 cada una)
    // en la fila siguiente.
    var anchos = [4, 3, 3], x = x0;
    for (i = 0; i < this.TECLAS_ESPECIALES.length; i++) {
      teclas.push({ tecla: this.TECLAS_ESPECIALES[i], x: x, y: y, ancho: anchos[i] * c, alto: c });
      x += anchos[i] * c;
    }
    return teclas;
  },

  // Tecla del teclado en pantalla en el punto p, o null.
  teclaEn: function (p) {
    var teclas = this.teclas();
    for (var i = 0; i < teclas.length; i++) {
      var t = teclas[i];
      if (p.x >= t.x && p.x < t.x + t.ancho && p.y >= t.y && p.y < t.y + t.alto) return t.tecla;
    }
    return null;
  },

  actualizar: function (dt) {
    if (this.fase) this.tiempo += dt;
  },

  centrado: function (ctx, letras, texto, y, escala) {
    var g = KF.graficos;
    g.escribir(ctx, letras, texto, (KF.ANCHO - g.anchoTexto(texto, escala)) / 2, y, escala);
  },

  // Texto alineado a la derecha en x.
  aLaDerecha: function (ctx, letras, texto, x, y) {
    KF.graficos.escribir(ctx, letras, texto, x - KF.graficos.anchoTexto(texto), y);
  },

  dibujarNombre: function (ctx) {
    var g = KF.graficos;
    if (this.perfil) {
      this.centrado(ctx, this.LETRAS_TITULO, 'NEW PROFILE', 30, 2);
      this.centrado(ctx, this.LETRAS_TEXTO, KF.dificultad.NIVELES[KF.dificultad.elegido], 60, 1);
      this.centrado(ctx, this.LETRAS_GRIS, 'ENTER ITS NAME', 84, 1);
    } else {
      this.centrado(ctx, this.LETRAS_TITULO, 'NEW HIGH SCORE', 30, 2);
      this.centrado(ctx, this.LETRAS_TEXTO, 'WAVE ' + this.oleada + '   ' + this.puntos + ' POINTS', 60, 1);
      this.centrado(ctx, this.LETRAS_GRIS, 'ENTER YOUR NAME', 84, 1);
    }
    // El nombre a doble tamaño, con una raya bajo cada hueco y la del
    // siguiente carácter parpadeando.
    var paso = (g.FUENTE_ANCHO + 1) * 2, x0 = (KF.ANCHO - g.anchoTexto('X'.repeat(this.LARGO_NOMBRE), 2)) / 2;
    var y = 102;
    g.escribir(ctx, this.LETRAS_TITULO, this.nombre, x0, y, 2);
    for (var i = 0; i < this.LARGO_NOMBRE; i++) {
      var cursor = i === this.nombre.length;
      if (cursor && Math.floor(this.tiempo * 3) % 2) continue;
      ctx.fillStyle = cursor ? this.COLOR_TITULO : this.COLOR_GRIS;
      ctx.fillRect(x0 + i * paso, y + g.FUENTE_ALTO * 2 + 2, g.FUENTE_ANCHO * 2, 1);
    }
    if (!this.tactil) {
      this.centrado(ctx, this.LETRAS_GRIS, 'PRESS ENTER TO SAVE', 140, 1);
      if (this.perfil) this.centrado(ctx, this.LETRAS_GRIS, 'ESC TO CANCEL', 152, 1);
      return;
    }
    // Teclado en pantalla.
    var teclas = this.teclas();
    for (i = 0; i < teclas.length; i++) {
      var t = teclas[i];
      ctx.strokeStyle = this.COLOR_GRIS;
      ctx.lineWidth = 0.5;
      ctx.strokeRect(t.x + 1, t.y + 1, t.ancho - 2, t.alto - 2);
      var letras = t.tecla === 'END' ? this.LETRAS_TITULO : this.LETRAS_TEXTO;
      g.escribir(ctx, letras, t.tecla, t.x + (t.ancho - g.anchoTexto(t.tecla)) / 2, t.y + (t.alto - g.FUENTE_ALTO) / 2);
    }
  },

  // Columnas de la tabla: puesto, nombre, oleada (a la derecha) y puntos (a la derecha).
  X_PUESTO: 24, X_NOMBRE: 42, X_OLEADA: 144, X_PUNTOS: 206,

  dibujarTabla: function (ctx) {
    this.centrado(ctx, this.LETRAS_TITULO, 'HALL OF FAME', 30, 2);
    var y = 62, lista = this.tabla();
    KF.graficos.escribir(ctx, this.LETRAS_GRIS, 'NAME', this.X_NOMBRE, y);
    this.aLaDerecha(ctx, this.LETRAS_GRIS, 'WAVE', this.X_OLEADA, y);
    this.aLaDerecha(ctx, this.LETRAS_GRIS, 'POINTS', this.X_PUNTOS, y);
    if (!lista.length) this.centrado(ctx, this.LETRAS_TEXTO, 'NO SCORES YET', y + 30, 1);
    for (var i = 0; i < lista.length; i++) {
      var e = lista[i], letras = i === this.nueva ? this.LETRAS_NUEVO : this.LETRAS_TEXTO;
      y += 16;
      this.aLaDerecha(ctx, letras, String(i + 1), this.X_PUESTO, y);
      KF.graficos.escribir(ctx, letras, e.nombre, this.X_NOMBRE, y);
      this.aLaDerecha(ctx, letras, String(e.oleada), this.X_OLEADA, y);
      this.aLaDerecha(ctx, letras, String(e.puntos), this.X_PUNTOS, y);
    }
  },

  dibujar: function (ctx) {
    if (!this.fase) return;
    // Fondo oscurecido: la formación sigue moviéndose detrás.
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, KF.ANCHO, KF.ALTO);
    if (this.fase === 'nombre') this.dibujarNombre(ctx);
    else this.dibujarTabla(ctx);
  }
};

(function () {
  var s = KF.salonFama, g = KF.graficos;
  s.LETRAS_TITULO = g.crearFuente(s.COLOR_TITULO);
  s.LETRAS_TEXTO = g.crearFuente(s.COLOR_TEXTO);
  s.LETRAS_GRIS = g.crearFuente(s.COLOR_GRIS);
  s.LETRAS_NUEVO = g.crearFuente(s.COLOR_NUEVO);
  // En el móvil (pantalla táctil) se escribe con el teclado en pantalla.
  s.tactil = 'ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
})();

// Después de Partida, para dibujarse encima de todo.
KF.registrar(KF.salonFama);
