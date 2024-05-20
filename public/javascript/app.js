const api = "http://localhost:3000";
export const getAPI = async () => {
    try {
        const rep = await fetch(api + "/products");
        const data = await rep.json();
        document.getElementById('loader').style.display = 'block';
        showProductTrending(data, 5);
        showNormalProduct(data, 8);
        document.getElementById('loader').remove();
    }
    catch (e) {
        console.log("Error: " + e);
    }
};
export const shop = async () => {
    try {
        const repC = await fetch(api + "/categories");
        const dataC = await repC.json();
        const repP = await fetch(api + "/products");
        const dataP = await repP.json();
        document.getElementById('loader').style.display = 'block';
        showAllProducts(dataP);
        showProductByCategory(dataC);
        document.getElementById('loader').remove();
    }
    catch (e) {
        console.log("Error: " + e);
    }
};
const showProductTrending = (data, limit) => {
    const discountedProducts = data.filter(item => item.discount === true);
    var html = "";
    discountedProducts.splice(0, limit).forEach(item => {
        html += `
      <div class="card border-0 product d-flex flex-column gap-2">
        <div class="image-product">
          <div class="onsale">Ưu đãi</div>
          <img src="/public/Imges/products/${item.image}" alt="">
          <div class="addto-cart">
            <button id="addCart" data-product-id="${item.id}" class="btn-addto-cart">Thêm vào giỏ hàng</button>
          </div>
        </div>
        <a href="product-detail.html?id=${item.id}" class="name-product">${item.name}</a>
        <span class="price-product">${item.price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        })}</span>
        <a class="buy-now" id="addCartDirect" data-product-id="${item.id}" href="?products/detail/${item.id}">Mua ngay</a>
      </div>
    `;
    });
    document.getElementById('product-trending').innerHTML = html;
};
const showNormalProduct = (data, limit) => {
    const discountedProducts = data.filter(item => item.discount === false);
    discountedProducts.sort(() => Math.random() - 0.5);
    var html = '';
    discountedProducts.splice(0, limit).forEach(item => {
        html += `
    <div class="product-small d-flex flex-column gap-2">
    <div class="image-product-small image-product">
      <img src="/public/Imges/products/${item.image}" alt="">
      <div class="addto-cart">
        <button class="btn-addto-cart">Thêm vào giỏ hàng</button>
      </div>
    </div>
    <a href="product-detail.html?id=${item.id}" class="name-product-small text-center">${item.name}</a>
    <span class="price-product">${item.price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        })}</span>
    <a class="buy-now" href="?products/detail/${item.id}">Mua ngay</a>
  </div>
    `;
    });
    document.getElementById('product-small').innerHTML += html;
};
const getBrandNameById = async (categoryId) => {
    const categoriesResponse = await fetch(api + "/categories");
    const categories = await categoriesResponse.json();
    const category = categories.find((cat) => cat.id_category === categoryId);
    return category ? category.name_category : "Unknown Category";
};
export const productDetail = async (id) => {
    const rep = await fetch(api + `/products/${id}`);
    const data = await rep.json();
    const categoryName = await getBrandNameById(data.brand);
    var html = `
  <div class="col-lg-6">
  <div class="img-product-detail d-flex gap-3">
    <div class="container-small-product-detail d-flex flex-column  align-items-center justify-content-between">
      <div class="img-small-product-d">
        <img src="/public/Imges/products/1.jpg" alt="">
      </div>
      <div class="img-small-product-d">
        <img src="/public/Imges/products/product2.jpg" alt="">
      </div>
      <div class="img-small-product-d">
        <img src="/public/Imges/products/3.jpg" alt="">
      </div>
    </div>
    <div class="img-big-product-d">
      <img src="/public/Imges/products/${data.image}" alt="">
    </div>
  </div>
</div>
<div class="col-lg-6">
  <div class="info-product-detail d-flex flex-column gap-4">
    <div class="text-head-product d-flex gap-2 flex-column">
      <div class="name-product-d">
        <span class="name_p-d">${data.name}</span>
      </div>
      <div class="category-product-d d-flex gap-4">
        <span>Hãng sản phẩm:</span>
        <span>${categoryName}</span>
      </div>
      <div class="description-product-d">
        <p class="description-product-detail">${data.description}</p>
      </div>
      <div class="price-product-d">
      <span class="">${data.price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
    })}</span>
      </div>
    </div>
    <div class="foot-product-detail d-flex gap-4">
      <div class="quality-product-d">
        <button class="quantity-btn increment-btn"><i class="fa-solid fa-angle-up"></i></button>
        <input type="text" class="quantity-input" value="0">
        <button class="quantity-btn decrement-btn"><i class="fa-solid fa-angle-down"></i></button>
      </div>
      <a class="btn-buynow" href="#">Mua Ngay</a>
      <button class="heart-addtocart" id="heart-btn">
        <i class="fas fa-heart"></i>
      </button>
    </div>
  </div>
</div>
  `;
    document.getElementById('product-detail').innerHTML = html;
};
export function showAllProducts(data) {
    var html = "";
    data.forEach(item => {
        html += `
    <div class="product-shop">
      <div class="image-product">
        <img src="/public/Imges/products/${item.image}" alt="">
        <div class="addto-cart">
          <button class="btn-addto-cart">Thêm vào giỏ hàng</button>
        </div>
      </div>
      <a href="product-detail.html?id=${item.id}" class="name-product">${item.name}</a>
      <span class="price-product">${item.price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })}</span>
      <a class="buy-now" href="#">Mua ngay</a>
    </div>
    `;
    });
    document.getElementById('productshop').innerHTML = html;
}
async function showProductByCategory(data) {
    var html = "";
    data.forEach(item => {
        html += `
    <li>
      <label for="category-${item.id_category}" data-id="${item.id_category}">${item.name_category}</label>
      <input type="checkbox" id="category-${item.id_category}" data-id="${item.id_category}">
    </li>
    `;
    });
    document.getElementById('categories').innerHTML = html;
    document.querySelectorAll('#categories li input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', async () => {
            try {
                const rep = await fetch(api + '/products');
                const products = await rep.json();
                const categories = document.querySelectorAll('#categories input[type="checkbox"]:checked');
                var selectedCategories = Array.from(categories).map(checkbox => checkbox.getAttribute('data-id'));
                console.log(selectedCategories);
                var filteredProducts;
                if (selectedCategories.length > 0) {
                    filteredProducts = products.filter((product) => selectedCategories.includes(product.brand.toString()));
                }
                else {
                    filteredProducts = products;
                }
                showAllProducts(filteredProducts);
            }
            catch (error) {
                console.log(error);
            }
        });
    });
}
