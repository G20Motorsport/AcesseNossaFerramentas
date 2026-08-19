const WHATSAPP_NUMBER = "5516993936497";

const form = document.getElementById("cadastro-form");
const submitBtn = document.getElementById("btn-enviar");

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function maskCPF(value) {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskCEP(value) {
  const d = onlyDigits(value).slice(0, 8);
  return d.replace(/(\d{5})(\d)/, "$1-$2");
}

function isValidCPF(cpf) {
  const d = onlyDigits(cpf);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(d[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(d[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(d[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === Number(d[10]);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(input, message) {
  input.classList.add("error");
  const errorEl = input.closest(".field").querySelector(".field-error");
  errorEl.textContent = message;
  errorEl.classList.add("show");
}

function clearError(input) {
  input.classList.remove("error");
  const errorEl = input.closest(".field").querySelector(".field-error");
  errorEl.textContent = "";
  errorEl.classList.remove("show");
}

const nome = document.getElementById("nome");
const cpf = document.getElementById("cpf");
const endereco = document.getElementById("endereco");
const cep = document.getElementById("cep");
const email = document.getElementById("email");

cpf.addEventListener("input", () => {
  cpf.value = maskCPF(cpf.value);
  clearError(cpf);
});

cep.addEventListener("input", () => {
  cep.value = maskCEP(cep.value);
  clearError(cep);
});

[nome, endereco, email].forEach((input) => {
  input.addEventListener("input", () => clearError(input));
});

function validate() {
  let valid = true;

  if (!nome.value.trim()) {
    setError(nome, "Preencha o nome completo.");
    valid = false;
  } else if (nome.value.trim().split(" ").filter(Boolean).length < 2) {
    setError(nome, "Informe o nome completo.");
    valid = false;
  }

  if (!cpf.value.trim()) {
    setError(cpf, "Preencha o CPF.");
    valid = false;
  } else if (!isValidCPF(cpf.value)) {
    setError(cpf, "CPF inválido.");
    valid = false;
  }

  if (!endereco.value.trim()) {
    setError(endereco, "Preencha o endereço completo.");
    valid = false;
  } else if (endereco.value.trim().length < 8) {
    setError(endereco, "Informe o endereço completo.");
    valid = false;
  }

  if (!cep.value.trim()) {
    setError(cep, "Preencha o CEP.");
    valid = false;
  } else if (onlyDigits(cep.value).length !== 8) {
    setError(cep, "CEP inválido.");
    valid = false;
  }

  if (!email.value.trim()) {
    setError(email, "Preencha o e-mail.");
    valid = false;
  } else if (!isValidEmail(email.value.trim())) {
    setError(email, "E-mail inválido.");
    valid = false;
  }

  return valid;
}

function buildMessage(data) {
  return [
    "*CADASTRO DE CLIENTE*",
    "G20 Motors Sports",
    "",
    "Segue a lista com os dados preenchidos:",
    "",
    `• *Nome completo:* ${data.nome}`,
    `• *CPF:* ${data.cpf}`,
    `• *Endereço completo:* ${data.endereco}`,
    `• *CEP:* ${data.cep}`,
    `• *E-mail:* ${data.email}`,
  ].join("\n");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validate()) return;

  const data = {
    nome: nome.value.trim(),
    cpf: cpf.value.trim(),
    endereco: endereco.value.trim(),
    cep: cep.value.trim(),
    email: email.value.trim(),
  };

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildMessage(data)
  )}`;

  submitBtn.disabled = true;
  submitBtn.querySelector("span").textContent = "Abrindo WhatsApp...";
  window.location.href = url;
});
