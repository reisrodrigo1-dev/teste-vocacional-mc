# 🖼️ Como Adicionar as Imagens das Notícias

## 📂 Estrutura de Pastas

As imagens devem estar em:
```
projeto/
└── public/
    └── noticias/
        ├── admin_1.jpg
        ├── admin_2.jpg
        ├── civil_1.jpg
        ├── civil_2.jpg
        ├── constitucional_1.jpg
        ├── constitucional_2.jpg
        ├── empresarial_1.jpg
        ├── empresarial_2.jpg
        ├── penal_1.jpg
        ├── penal_2.jpg
        ├── trabalho_1.jpg
        ├── trabalho_2.jpg
        ├── tributario_1.jpg
        └── tributario_2.jpg
```

## 📥 Opção 1: Adicionar Manualmente

1. Abra a pasta `public/noticias/` no seu computador
2. Coloque as 14 imagens JPG/PNG dentro
3. Nomeie exatamente como mostrado acima

## 📥 Opção 2: Download de Um Repositório

Se você tem as imagens em um repositório:

```bash
# Na pasta projeto/
git clone <repo-com-imagens> temp-noticias
mv temp-noticias/noticias/* public/noticias/
rm -r temp-noticias
```

## 📥 Opção 3: Criar Placeholder

Se não tiver as imagens ainda, crie um placeholder:

```bash
cd public/noticias/

# Linux/Mac - criar imagem cinza
for i in admin civil constitucional empresarial penal trabalho tributario; do
  convert -size 300x200 xc:#e0e0e0 ${i}_1.jpg
  convert -size 300x200 xc:#e0e0e0 ${i}_2.jpg
done

# Ou use Python para criar:
python3 << 'EOF'
from PIL import Image
areas = ['admin', 'civil', 'constitucional', 'empresarial', 'penal', 'trabalho', 'tributario']
for area in areas:
    img = Image.new('RGB', (300, 200), color='#e0e0e0')
    img.save(f'{area}_1.jpg')
    img.save(f'{area}_2.jpg')
EOF
```

## 📥 Opção 4: Usar URLs Externas

Se quiser não duplicar arquivos, edite `src/data/news.ts`:

```typescript
export const newsData: NewsItem[] = [
  {
    id: 'admin_1',
    area: 'Administrativo',
    title: 'Lei de Licitações e Contratos Administrativos',
    image: 'https://sua-url.com/admin_1.jpg'  // ← URL externa
  },
  // ...
];
```

E em `Quiz.tsx`, mude:
```tsx
src={`/noticias/${news.image}`}  // ← Era assim
// Para:
src={news.image}  // ← Agora pode ser URL direta
```

## 🎨 Dimensões Recomendadas

- **Proporção**: 3:2 (300x200, 600x400, etc)
- **Formato**: JPG (menor tamanho) ou PNG
- **Tamanho**: Máximo 100KB por imagem
- **Qualidade**: Alta o suficiente para ser legível

## ✅ Teste Se As Imagens Estão Funcionando

1. Abra http://localhost:5173
2. Faça login
3. Vá até a pergunta 4 (notícias)
4. Veja se as imagens aparecem

Se não aparecerem:
- Verifique se o nome está correto
- Verifique se está em `public/noticias/`
- Abra o console (F12) para ver erros
- Verifique se o servidor está rodando

## 🛠️ Solução de Problemas

### Imagens não aparecem
```
Solução 1: Verifique o caminho em public/noticias/
Solução 2: Limpe o cache do navegador (Ctrl+Shift+Delete)
Solução 3: Reinicie o servidor (npm run dev)
```

### Imagens cortadas
```
Isso é normal - CSS faz object-fit: cover
Para mudar, edite NewsImageContainer em Quiz.tsx
```

### Imagens muito lentas
```
Otimize: use ferramentas como TinyPNG
Comprima para máximo 50KB por imagem
```

## 📝 Checklist Final

- ✅ Pasta `public/noticias/` existe
- ✅ 14 imagens estão dentro (2 por área)
- ✅ Nomes exatos: admin_1.jpg, admin_2.jpg, etc
- ✅ Formato: JPG ou PNG
- ✅ Tamanho: ~50KB ou menos por imagem
- ✅ Servidor rodando (npm run dev)
- ✅ Imagens aparecem no Quiz

---

**Pronto!** As imagens estão sendo usadas pelo sistema de votação 👍👎

