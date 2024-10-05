const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(express.json());

console.log('Bem vindo ao Bot conversor API 🤖💰');

// Função que realiza a conversão de moedas usando Puppeteer
async function getCurrencyConversion(moedaBase, moedaFinal) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const url = `https://www.google.com/search?q=${moedaBase}+para+${moedaFinal}`;
  await page.goto(url);

  // Captura o valor da conversão usando o Puppeteer
  const resultado = await page.evaluate(() => {
    const element = document.querySelector('.lWzCpb.a61j6');
    return element ? element.value : null;
  });

  await browser.close();
  return resultado;
}

// Rota para conversão de moedas
app.get('/api/converter', async (req, res) => {
  const { moedaBase, moedaFinal } = req.query;

  if (!moedaBase || !moedaFinal) {
    return res.status(400).json({ error: 'Você deve fornecer moedaBase e moedaFinal' });
  }

  try {
    const resultado = await getCurrencyConversion(moedaBase, moedaFinal);

    if (resultado) {
      res.json({ 
        moedaBase, 
        moedaFinal, 
        valor: resultado 
      });
    } else {
      res.status(500).json({ error: 'Não foi possível realizar a conversão.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar a conversão.', detalhes: error.message });
  }
});

// Iniciar o servidor
app.listen(port,"192.168.1.172", () => {
  console.log(`API de conversão rodando na porta ${port}`);
});
