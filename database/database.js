import * as SQLite from 'expo-sqlite';

let db = null;

export async function getDatabase() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('artigos_esportivos.db');
  await inicializarBanco(db);
  return db;
}

async function inicializarBanco(database) {
  await database.execAsync('PRAGMA foreign_keys = ON;');

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      criado_em TEXT DEFAULT (datetime('now','localtime'))
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      categoria TEXT NOT NULL,
      imagem TEXT,
      usuario_id INTEGER NOT NULL,
      criado_em TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);

  const count = await database.getFirstAsync('SELECT COUNT(*) as total FROM produtos');
  if (count.total === 0) {
    const admin = await database.getFirstAsync("SELECT id FROM usuarios WHERE email = 'admin@esportivos.com'");
    let adminId;
    if (!admin) {
      const result = await database.runAsync(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        ['Administrador', 'admin@esportivos.com', 'admin123']
      );
      adminId = result.lastInsertRowId;
    } else {
      adminId = admin.id;
    }

    const produtosIniciais = [
      ['Chuteira Futebol Profissional', 549.90, 'Chuteiras', null, adminId],
      ['Bola de Campo Profissional', 259.00, 'Bolas', null, adminId],
      ['Camisa de Treino Dry-Fit', 99.90, 'Vestuário', null, adminId],
      ['Par de Caneleiras', 45.00, 'Acessórios', null, adminId],
      ['Luvas de Goleiro Grip', 249.00, 'Acessórios', null, adminId],
    ];

    for (const p of produtosIniciais) {
      await database.runAsync(
        'INSERT INTO produtos (nome, preco, categoria, imagem, usuario_id) VALUES (?, ?, ?, ?, ?)',
        p
      );
    }
  }
}


export async function criarUsuario(nome, email, senha) {
  const database = await getDatabase();
  try {
    const result = await database.runAsync(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senha]
    );
    return { sucesso: true, id: result.lastInsertRowId };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return { sucesso: false, erro: 'Este e-mail já está cadastrado.' };
    }
    return { sucesso: false, erro: 'Erro ao criar conta. Tente novamente.' };
  }
}

export async function loginUsuario(email, senha) {
  const database = await getDatabase();
  const usuario = await database.getFirstAsync(
    'SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha]
  );
  if (usuario) {
    return { sucesso: true, usuario };
  }
  return { sucesso: false, erro: 'E-mail ou senha incorretos.' };
}

export async function buscarUsuario(id) {
  const database = await getDatabase();
  return await database.getFirstAsync(
    'SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?',
    [id]
  );
}


export async function listarProdutos() {
  const database = await getDatabase();
  return await database.getAllAsync(
    'SELECT p.*, u.nome as usuario_nome FROM produtos p LEFT JOIN usuarios u ON p.usuario_id = u.id ORDER BY p.id DESC'
  );
}

export async function buscarProduto(id) {
  const database = await getDatabase();
  return await database.getFirstAsync(
    'SELECT p.*, u.nome as usuario_nome FROM produtos p LEFT JOIN usuarios u ON p.usuario_id = u.id WHERE p.id = ?',
    [id]
  );
}

export async function criarProduto(nome, preco, categoria, imagem, usuarioId) {
  const database = await getDatabase();
  const result = await database.runAsync(
    'INSERT INTO produtos (nome, preco, categoria, imagem, usuario_id) VALUES (?, ?, ?, ?, ?)',
    [nome, preco, categoria, imagem, usuarioId]
  );
  return result.lastInsertRowId;
}

export async function atualizarProduto(id, nome, preco, categoria, imagem) {
  const database = await getDatabase();
  await database.runAsync(
    'UPDATE produtos SET nome = ?, preco = ?, categoria = ?, imagem = ? WHERE id = ?',
    [nome, preco, categoria, imagem, id]
  );
}

export async function deletarProduto(id) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM produtos WHERE id = ?', [id]);
}

export async function listarProdutosPorUsuario(usuarioId) {
  const database = await getDatabase();
  return await database.getAllAsync(
    'SELECT * FROM produtos WHERE usuario_id = ? ORDER BY id DESC',
    [usuarioId]
  );
}
