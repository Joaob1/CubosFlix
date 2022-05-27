const divMovies = document.querySelector(".movies");

const body = document.querySelector("body");

const modal = document.querySelector(".modal");
const tituloModal = document.querySelector(".modal__title");
const imagemModal = document.querySelector(".modal__img");
const descricaoModal = document.querySelector(".modal__description");
const generos_notaModal = document.querySelector(".modal__genre-average");
const generosModal = document.querySelector(".modal__genres");
const notaModal = document.querySelector(".modal__average");

const input = document.querySelector("input");

const botaoTema = document.querySelector(".btn-theme");

const botaoNext = document.querySelector(".btn-next");
const botaoPrev = document.querySelector(".btn-prev");

let paginasAtuais = [];
let paginaAtiva;

let filmesIniciais = [];
let ContadorPaginasIniciais = [];

let paginasPesquisa = [];
let contadorPaginasPesquisa = [];

const mostrarPagina = () => {
  fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
  ).then((response) => {
    const promiseBody = response.json();
    promiseBody.then((body) => {
      body.results.forEach((element) => {
        if (ContadorPaginasIniciais.length === 5) {
          filmesIniciais.push(ContadorPaginasIniciais);
          ContadorPaginasIniciais = [];
          ContadorPaginasIniciais.push(element);
        } else if (ContadorPaginasIniciais.length < 5) {
          ContadorPaginasIniciais.push(element);
        }
      });
      filmesIniciais.push(ContadorPaginasIniciais);
      paginasAtuais = filmesIniciais;
      paginaAtiva = paginasAtuais[0];
      popularFilmes();
      addModal();
    });
  });
};
mostrarPagina();

const popularFilmes = () => {
  divMovies.textContent = "";
  paginaAtiva.forEach((filme) => {
    const movie = document.createElement("div");
    movie.classList.add("movie");
    movie.style.backgroundImage = `url(${filme.poster_path})`;
    const infos = document.createElement("div");
    infos.classList.add("movie__info");
    const titulo = document.createElement("span");
    titulo.classList.add("movie__title");
    titulo.textContent = filme.title;
    const estrela = document.createElement("img");
    estrela.alt = "Estrela";
    estrela.src = "./assets/estrela.svg";
    const rating = document.createElement("span");
    rating.classList.add("movie__rating");
    rating.append(estrela, filme.vote_average);
    infos.append(titulo, rating);
    movie.append(infos);
    divMovies.append(movie);
  });
};

botaoNext.addEventListener("click", () => {
  paginasAtuais.push(paginasAtuais[0]);
  paginasAtuais.shift();
  paginaAtiva = paginasAtuais[0];
  popularFilmes();
  addModal();
});
botaoPrev.addEventListener("click", () => {
  paginasAtuais.unshift(paginasAtuais[paginasAtuais.length - 1]);
  paginasAtuais.pop();
  paginaAtiva = paginasAtuais[0];
  popularFilmes();
  addModal();
});


const addModal = () => {
  for (let i = 0; i < divMovies.children.length; i++) {
    divMovies.children[i].addEventListener("click", () => {
      modal.classList.remove("hidden");
      fetch(
        `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${paginaAtiva[i].id}?language=pt-BR`
      ).then((res) => {
        const prom = res.json();
        prom.then((body) => {
          tituloModal.textContent = body.title;
          imagemModal.src = body.backdrop_path;
          descricaoModal.textContent = body.overview;
          if (descricaoModal.textContent === "") {
            descricaoModal.textContent =
              "Não foi possível encontrar uma sinopse para o filme";
          }
          notaModal.textContent = body.vote_average;
          fetch(
            `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${paginaAtiva[i].id}?language=pt-BR`
          ).then((resposta) => {
            const promise = resposta.json();
            promise.then((bodyFilme) => {
              bodyFilme.genres.forEach((genero) => {
                const generoModal = document.createElement("div");
                generoModal.classList.add("modal__genre");
                generoModal.textContent = genero.name;
                generosModal.append(generoModal);
                modal.addEventListener("click", () => {
                  modal.classList.add("hidden");
                  generoModal.remove();
                });
              });
            });
          });
        });
      });
    });
  }
};


const linkdoVideo = document.querySelector(".highlight__video-link");
const videoHighlight = document.querySelector(".highlight__video");
const tituloHighlight = document.querySelector(".highlight__title");
const generosHighlight = document.querySelector(".highlight__genres");
const dataHighlight = document.querySelector(".highlight__launch");
const descricaoHighlight = document.querySelector(".highlight__description");
const notaHighlight = document.querySelector(".highlight__rating");

fetch(
  "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
).then((response) => {
  const promise = response.json();
  promise.then((promiseBody) => {
    videoHighlight.style.backgroundImage = `url(${promiseBody.backdrop_path}`;
    tituloHighlight.textContent = promiseBody.title;
    notaHighlight.textContent = promiseBody.vote_average;
    let generos = [];
    promiseBody.genres.forEach((genero) => {
      generos.push(genero.name);
    });
    generosHighlight.textContent = generos.join(", ");
    dataHighlight.textContent = `${new Date(
      promiseBody.release_date
    ).getUTCDate()}/${new Date(
      promiseBody.release_date
    ).getUTCMonth()}/${new Date(promiseBody.release_date).getFullYear()}`;
    descricaoHighlight.textContent = promiseBody.overview;
    fetch(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
    ).then((resposta) => {
      const promessa = resposta.json();
      promessa.then((video) => {
        linkdoVideo.href = `https://www.youtube.com/watch?v=${video.results[0].key}`;
      });
    });
  });
});

input.addEventListener("keydown", () => {
  if (event.key !== "Enter") {
    return;
  }
  if (!input.value) {
    paginasAtuais = filmesIniciais;
    mostrarPagina();
    return;
  }
  paginasPesquisa = [];
  contadorPaginasPesquisa = [];
  divMovies.textContent = "";
  fetch(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query=${input.value}`
  ).then((respostaPesquisa) => {
    const promisePesquisa = respostaPesquisa.json();
    promisePesquisa.then((bodyPesquisa) => {
      bodyPesquisa.results.forEach((elemento) => {
        if (contadorPaginasPesquisa.length === 5) {
          paginasPesquisa.push(contadorPaginasPesquisa);
          contadorPaginasPesquisa = [];
          contadorPaginasPesquisa.push(elemento);
        } else if (contadorPaginasPesquisa.length < 5) {
          contadorPaginasPesquisa.push(elemento);
        }
      });
      paginasPesquisa.push(contadorPaginasPesquisa);
      paginasAtuais = paginasPesquisa;
      paginaAtiva = paginasAtuais[0];
      popularFilmes();
      addModal();
      input.value = "";
    });
  });
});

const temaInicial = localStorage.getItem("tema");
let temaAtual = temaInicial ? temaInicial : "Claro";

const temaClaro = () => {
  temaAtual = "Claro";

  body.style.setProperty("--background-color", "#FFF");
  body.style.setProperty("--color", "#000");
  body.style.setProperty("--input-background-color", "#979797");
  body.style.setProperty("--highlight-background", "#FFF");
  body.style.setProperty("--highlight-color", "rgba(0, 0, 0, 0.7)");
  body.style.setProperty("--highlight-description", "#000");
  body.style.setProperty("--shadow-color", "0px 4px 8px rgba(0, 0, 0, 0.15)");

  botaoTema.src = "./assets/light-mode.svg";
  botaoNext.src = "./assets/seta-direita-preta.svg";
  botaoPrev.src = "./assets/seta-esquerda-preta.svg";
};

const temaEscuro = () => {
  temaAtual = "Escuro";

  body.style.setProperty("--background-color", "#242424");
  body.style.setProperty("--color", "#FFF");
  body.style.setProperty("--input-background-color", "#FFF");
  body.style.setProperty(
    "--shadow-color",
    "0px 4px 8px rgba(255, 255, 255, 0.15)"
  );
  body.style.setProperty("--highlight-background", "#454545");
  body.style.setProperty("--highlight-color", "rgba(255, 255, 255, 0.7)");
  body.style.setProperty("--highlight-description", "#FFF");

  botaoTema.src = "./assets/dark-mode.svg";
  botaoNext.src = "./assets/seta-direita-branca.svg";
  botaoPrev.src = "./assets/seta-esquerda-branca.svg";
};

const mudarTema = () => {
  temaAtual === "Claro" ? temaEscuro() : temaClaro();
  localStorage.setItem("tema", temaAtual);
};
temaAtual === "Claro" ? temaClaro() : temaEscuro();

botaoTema.addEventListener("click", mudarTema);