"use strict";

var nome = "";
var velocidade = "";
var select = "";

/*Captura os dados informados no input do formulário através do método POST*/
var button = document.querySelector("button");
button.onclick = function () {
  nome = document.querySelector("#nome");
  const temaRadio = document.querySelector("input[name='tema']:checked").value;
  const nivelRadio = document.querySelector(
    "input[name='nivel']:checked"
  ).value;
  const distanciaRadio = document.querySelector(
    "input[name='distancia']:checked"
  ).value;
  velocidade = document.querySelector("#velocidade");
  select = document.querySelector("#select");
  const tipoRadio = document.querySelector("input[name='tipo']:checked").value;
  const personagemRadio = document.querySelector(
    "input[name='personagem']:checked"
  ).value;
  const pontoRadio = document.querySelector(
    "input[name='pontos']:checked"
  ).value;

  /*Mostra na tela uma mensagem de confirmação de todas as configurações setadas através de concatenação das variáveis obtidas anteriormente*/
  confirm(
    "Configuração escolhida:\n" +
      "Nome: " +
      nome.value +
      "\nCenário do Jogo: " +
      temaRadio +
      "\nIntervalo entre abertura dos canos: " +
      nivelRadio +
      "\nDistancia entre os canos: " +
      distanciaRadio +
      "\nVelocidade do Jogo: " +
      velocidade.value +
      "\nPersonagem: " +
      select.value +
      "\nTipo do Jogo: " +
      tipoRadio +
      "\nVelocidade dos Personagem: " +
      personagemRadio +
      "\nPontuação: " +
      pontoRadio
  );

  const myForm = document.getElementById("myForm"); //relaciona com o id do formulário
  myForm.addEventListener("submit", gravar);

  function gravar(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const searchParams = new URLSearchParams();

    for (const par of formData) {
      //separa os array para receber as 9 valores do input do formulário
      searchParams.append(
        par[0],
        par[1],
        par[2],
        par[3],
        par[4],
        par[5],
        par[6],
        par[7],
        par[8]
      );
    }

    fetch("cadastroconfig.php", {
      //arquivo criado para inserir os valores dos inputs do formulario no banco de dados local.
      //JavaScript tem sua própria maneira integrada de fazer solicitações de API. Isso é feito pela Fetch API, um novo padrão para fazer solicitações de servidor com promessas
      method: "POST",
      body: formData,
    })
      .then(function (response) {
        document.getElementById("nome").value = " "; //limpar o campo nome depois de executar a solicitação

        return alert("Dados gravados com sucesso." + "\nBom Jogo!"); //Retorna uma janela informando a inserção dos dados no banco de dados.
        //return (window.location = "jogo.html");
      })
      .catch(function (error) {
        //tratamento para o caso de erro na inserção
        console.log(error);
      });
  }

  function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    return elemento;
  }

  function Barreira(reversa = false) {
    this.elemento = novoElemento("div", "barreira");
    const borda = novoElemento("div", "borda");
    const corpo = novoElemento("div", "corpo");
    this.elemento.appendChild(reversa ? corpo : borda);
    this.elemento.appendChild(reversa ? borda : corpo);

    this.setAltura = (altura) => (corpo.style.height = `${altura}px`);
  }

  /*Cria condição para configurar o nível de Intervalo entre aberturas dos canos */
  var nivelConfig = function (superior) {
    if (nivelRadio == "facil") {
      return superior * 3;
    } else if (nivelRadio == "medio") {
      return superior * 4;
    } else nivelRadio == "dificil";
    return superior * 5;
  };

  var alturaSuperior = nivelConfig(50);
  var alturaInferior = nivelConfig(50);

  function ParDeBarreiras(altura, abertura, popsicaoNaTela) {
    this.elemento = novoElemento("div", "par-de-barreiras");
    this.superior = new Barreira(true);
    this.inferior = new Barreira(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferior.elemento);

    this.sortearAbertura = () => {
      // const alturaSuperior = Math.random() * (altura - abertura);
      // const alturaInferior = altura - abertura - alturaSuperior;

      this.superior.setAltura(alturaSuperior); //Chama a variavel que recebe o valor na condição do intervalo entre os canos
      this.inferior.setAltura(alturaInferior);
    };

    this.getX = () => parseInt(this.elemento.style.left.split("px")[0]);
    this.setX = (popsicaoNaTela) =>
      (this.elemento.style.left = `${popsicaoNaTela}px`);
    this.getLargura = () => this.elemento.clientWidth;

    this.sortearAbertura();
    this.setX(popsicaoNaTela);
  }

  function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
      new ParDeBarreiras(altura, abertura, largura),
      new ParDeBarreiras(altura, abertura, largura + espaco),
      new ParDeBarreiras(altura, abertura, largura + espaco * 2),
      new ParDeBarreiras(altura, abertura, largura + espaco * 3),
    ];

    var deslocamento = 3;

    this.animar = () => {
      this.pares.forEach((par) => {
        par.setX(par.getX() - deslocamento);

        if (par.getX() < -par.getLargura()) {
          par.setX(par.getX() + espaco * this.pares.length);
          par.sortearAbertura();
        }
        const meio = largura / 2;
        const cruzouMeio =
          par.getX() + deslocamento >= meio && par.getX() < meio;
        if (cruzouMeio) {
          notificarPonto();
        }
      });
    };
  }

  /*Cria condição para configurar o personagem que será escolhido para jogar */
  function Passaro(alturaJogo) {
    let voando = false;

    if (select.value == "Passaro") {
      this.elemento = novoElemento("img", "passaro");
      this.elemento.src = "img/passaro.png";
    }

    if (select.value == "Abelha") {
      this.elemento = novoElemento("img", "passaro");
      this.elemento.src = "img/abelha.png";
    }

    if (select.value == "Dragao") {
      this.elemento = novoElemento("img", "passaro");
      this.elemento.src = "img/dragon.png";
    }

    this.getY = () => parseInt(this.elemento.style.bottom.split("px")[0]);
    this.setY = (y) => (this.elemento.style.bottom = `${y}px`);

    window.onkeydown = (e) => (voando = true);
    window.onkeyup = (e) => (voando = false);

    /*Cria condição para configurar a velocidade em que o personagem irá voar dependendo das variaveis sobe e gravidade */
    //Atribuindo o valor de uma função para a variavel valPersonagem
    var velPersonagem = function (vel) {
      if (personagemRadio == "baixa") {
        return vel * 1;
      } else if (personagemRadio == "media") {
        return vel * 1.5;
      } else personagemRadio == "rapida";
      return vel * 2;
    };

    var sobe = velPersonagem(8);
    var gravidade = velPersonagem(-5);

    this.animar = () => {
      const novoY = this.getY() + (voando ? sobe : gravidade);
      const alturaMaxima = alturaJogo - this.elemento.clientWidth;

      if (novoY <= 0) {
        this.setY(0);
      } else if (novoY >= alturaMaxima) {
        this.setY(alturaMaxima);
      } else {
        this.setY(novoY);
      }
    };
    this.setY(alturaJogo / 2);
  }

  function Progresso() {
    this.elemento = novoElemento("span", "progresso");
    this.atualizarPontos = (pontos) => {
      this.elemento.innerHTML = pontos;
    };
    this.atualizarPontos(0);
  }

  function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect();
    const b = elementoB.getBoundingClientRect();
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

    return horizontal && vertical;
  }

  /*Cria condição para configurar o tipo de jogo que será executado podendo ser treino (não colide) e real (colide) */
  function colidiu(passaro, barreiras) {
    let colidiu = false;
    barreiras.pares.forEach((parDeBarreiras) => {
      if (tipoRadio == "real") {
        if (!colidiu) {
          const superior = parDeBarreiras.superior.elemento;
          const inferior = parDeBarreiras.inferior.elemento;
          colidiu =
            estaoSobrepostos(passaro.elemento, superior) ||
            estaoSobrepostos(passaro.elemento, inferior);
        }
      } else {
        if (colidiu) {
          const superior = parDeBarreiras.superior.elemento;
          const inferior = parDeBarreiras.inferior.elemento;
          colidiu =
            estaoSobrepostos(passaro.elemento, superior) ||
            estaoSobrepostos(passaro.elemento, inferior);
        }
      }
    });

    return colidiu;
  }

  /*Cria condição para configurar a velocidade do jogo podendo variar entre 1 e 10*/
  //atribuindo o retorno da função para dentro da variavel configVelocidade
  var configVelocidade = function (speed) {
    if (velocidade.value == "1") {
      speed = 45;
    }
    if (velocidade.value == "2") {
      speed = 40;
    }
    if (velocidade.value == "3") {
      speed = 35;
    }
    if (velocidade.value == "4") {
      speed = 30;
    }
    if (velocidade.value == "5") {
      speed = 25;
    }
    if (velocidade.value == "6") {
      speed = 20;
    }
    if (velocidade.value == "7") {
      speed = 15;
    }
    if (velocidade.value == "8") {
      speed = 10;
    }
    if (velocidade.value == "9") {
      speed = 5;
    }
    if (velocidade.value == "10") {
      speed = 1;
    }
    return speed;
  };

  //atribuindo valor da função retornada para a variavel configSpeed
  var configSpeed = configVelocidade();

  function FlappyBird() {
    let pontos = 0;

    const areaDoJogo = document.querySelector("[wm-flappy]");
    const altura = areaDoJogo.clientHeight;
    const largura = areaDoJogo.clientWidth;

    const progresso = new Progresso();

    /*Cria condição para configurar a quantidade de pontos para cada barreira ultrapassada, podendo ser 1, 10 ou 100*/
    //condiçào para 10
    var configPont = function (score) {
      if (pontoRadio == "10") {
        score = new Barreiras(altura, largura, 200, 400, () =>
          progresso.atualizarPontos(++pontos * 10)
        ); //condição para 100
      } else if (pontoRadio == "100") {
        score = new Barreiras(altura, largura, 200, 400, () =>
          progresso.atualizarPontos(++pontos * 100)
        );
      } else {
        //condição para 1, restou de opção no ratio
        score = new Barreiras(altura, largura, 200, 400, () =>
          progresso.atualizarPontos(++pontos)
        );
      }
      return score;
    };

    //variavel barreiras recebeu o retorno da função dos pontos
    const barreiras = configPont();

    const passaro = new Passaro(altura);

    areaDoJogo.appendChild(progresso.elemento);
    areaDoJogo.appendChild(passaro.elemento);
    barreiras.pares.forEach((par) => areaDoJogo.appendChild(par.elemento));

    this.start = () => {
      const temporizador = setInterval(() => {
        barreiras.animar();
        passaro.animar();

        if (colidiu(passaro, barreiras)) {
          clearInterval(temporizador);
          confirm(
            "Fim de Jogo!" + "\nSua pontuação total é:" + progresso.value
          );
        }
      }, configSpeed); //chamando a variavel responsavel por receber o valor da velocidade do jogo entre 1(mais lento) e 10(mais rápjdo).
    };
  }

  new FlappyBird().start();
};
