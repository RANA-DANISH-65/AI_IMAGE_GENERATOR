const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const generateBtn = document.querySelector(".genBtn");
const OPENAI_API_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzg5ZWI4ZjctNWFkNC00YmU1LTgzZTItZjMxMWE4Nzg0ZWRkIiwidHlwZSI6ImFwaV90b2tlbiJ9.dT70MUOlr6srkbtm9tOnN8M3GKeacyh7AgtGQMAW9qI";
let isImageGenerating = false;

const updateImageCards = (imgDataArray) => {
  imgDataArray.forEach((provider) => {
    if (
      provider.status === "success" &&
      provider.items &&
      provider.items.length > 0
    ) {
      provider.items.forEach((item, index) => {
        const imgCard = imageGallery.querySelectorAll(".image-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-icon");

        const aiGeneratedImage = item.image_resource_url;
        imgElement.src = aiGeneratedImage;

        imgElement.onload = () => imgCard.classList.remove("loading");
        downloadBtn.setAttribute("href", aiGeneratedImage);
        downloadBtn.setAttribute("download", `${Date.now()}.jpg`);
      });
    }
  });
};

const Generator = async (prompt, quantity) => {
  try {
    const response = await fetch("https://api.edenai.run/v2/image/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        response_as_dict: true,
        attributes_as_list: false,
        show_base_64: true,
        show_original_response: false,
        providers: "deepai,stabilityai,replicate,openai,amazon",
        text: prompt,
        resolution: "512x512",
        num_images: quantity,
      }),
    });

    const data = await response.json();
    if (!response.ok) 
        throw new Error("Failed to generate Images!");

    const imgDataArray = Object.values(data)
    updateImageCards(imgDataArray);
  } catch (error) {
    alert(error.message);
  } finally {
    isImageGenerating = false;
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
  }
};

const ImageGeneration = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;

  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating";
  isImageGenerating = true;

  const userPrompt = e.srcElement[0].value.trim()
  const imgQuantity = parseFloat(e.srcElement[1].value);

  const imageCardMakeup = Array.from({ length: imgQuantity },() => `
            <div class="image-card loading">
                <img src="Assets/loader.svg" alt="image">
                <a href="#" class="download-icon">
                    <img src="Assets/download.svg" alt="download-option">
                </a>
            </div>
        `
  ).join("");

  imageGallery.innerHTML = imageCardMakeup;

  Generator(userPrompt, imgQuantity);
};

generateForm.addEventListener("submit", ImageGeneration);

const changeBackground = () => {
  const backgrounds = [
    "Assets/R.jpg",
    "Assets/back1.jpg",
    "Assets/back2.jpg",
    "Assets/back3.jpg",
    "Assets/bg.jpg",
  ];

  setInterval(() => {
    const backgroundDiv = document.querySelector(".image-generator");
    const randomBackground = Math.floor(Math.random() * backgrounds.length);
    backgroundDiv.style.backgroundImage = `url(${backgrounds[randomBackground]})`;
  }, 3500);
};

changeBackground();
