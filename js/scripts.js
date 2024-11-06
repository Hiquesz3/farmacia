$(document).ready(function() {
    // Carregar carrinho do LocalStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Carregar produtos do LocalStorage ou usar lista pré-definida
    let products = JSON.parse(localStorage.getItem('products')) || [
        { id: 1, name: "Medicamento A", price: 10.00, image: "https://via.placeholder.com/150", description: "Descrição do Medicamento A." },
        { id: 2, name: "Medicamento B", price: 20.00, image: "https://via.placeholder.com/150", description: "Descrição do Medicamento B." },
        { id: 3, name: "Medicamento C", price: 30.00, image: "https://via.placeholder.com/150", description: "Descrição do Medicamento C." }
    ];

    // Exibir produtos na página de produtos
    function displayProducts() {
        $('#product-list').empty();  // Limpar a lista de produtos antes de exibir novamente
        products.forEach(product => {
            $('#product-list').append(`
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">R$ ${product.price.toFixed(2)}</p>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Adicionar produto ao carrinho
    $(document).on('click', '.add-to-cart', function() {
        const productId = $(this).data('id');
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            // Se o produto já estiver no carrinho, aumenta a quantidade
            cartItem.quantity += 1;
        } else {
            // Caso contrário, adiciona o produto ao carrinho com quantidade inicial de 1
            cart.push({ ...product, quantity: 1 });
        }

        // Salvar o carrinho no LocalStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Atualizar a contagem do carrinho e o total
        updateCartCount();
        updateCartTotal();

        // Exibir itens no carrinho
        loadCartItems();

        alert(`${product.name} adicionado ao carrinho!`);
    });

    // Atualizar contagem do carrinho
    function updateCartCount() {
        $('#cart-count').text(cart.length).toggle(cart.length > 0);
    }

    // Carregar itens do carrinho
    function loadCartItems() {
        $('#cart-items').empty();

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            $('#cart-items').append(`
                <div class="cart-item">
                    <span>${item.name} - Quantidade: <input type="number" class="item-quantity" data-id="${item.id}" value="${item.quantity}" min="1" /></span>
                    <span>R$ ${itemTotal.toFixed(2)}</span>
                </div>
            `);
        });
    }

    // Atualizar contagem do carrinho
    function updateCartTotal() {
        let totalPrice = 0;

        cart.forEach(item => {
            totalPrice += item.price * item.quantity;
        });

        $('#total-price').text(`R$ ${totalPrice.toFixed(2)}`);
    }

    // Atualizar a quantidade do item no carrinho
    $(document).on('change', '.item-quantity', function() {
        const itemId = $(this).data('id');
        const newQuantity = parseInt($(this).val(), 10);
        const cartItem = cart.find(item => item.id === itemId);

        if (cartItem && newQuantity > 0) {
            cartItem.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));  // Atualiza o carrinho no LocalStorage
            updateCartTotal();
            loadCartItems();
        }
    });

    // Finalizar compra
    $('#checkout-form').submit(function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        alert('Compra finalizada com sucesso! Obrigado pelo seu pedido. Você receberá mais informações em breve.');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));  // Limpar o carrinho no LocalStorage
        updateCartCount();
        loadCartItems();
        updateCartTotal();  // Zera o total após finalizar a compra
        $(this).trigger("reset");
    });

    // Adicionar produtos pelo admin
    $('#add-product-form').submit(function(e) {
        e.preventDefault();
        const newProduct = {
            id: products.length + 1,
            name: $('#product-name').val(),
            price: parseFloat($('#product-price').val()),
            image: $('#product-image').val(),
            description: $('#product-description').val(),
        };

        // Adiciona o novo produto na lista de produtos
        products.push(newProduct);

        // Salvar a lista de produtos no LocalStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Alerta para confirmar a adição
        alert('Produto adicionado com sucesso!');

        // Limpar o formulário
        $(this).trigger("reset");

        // Atualizar a lista de produtos na tela
        displayProducts();
    });

    // Excluir produto da lista de produtos
    $(document).on('click', '.delete-product', function() {
        const productId = $(this).data('id');
        
        // Filtra os produtos para remover o produto com o id correspondente
        products = products.filter(product => product.id !== productId);

        // Atualiza o LocalStorage com a lista de produtos modificada
        localStorage.setItem('products', JSON.stringify(products));

        // Atualiza a exibição dos produtos na página de administração
        displayAdminProducts();

        // Atualiza a exibição dos produtos na página de produtos (depois de excluir)
        displayProducts();

        alert('Produto excluído com sucesso!');
    });

    // Exibir produtos na página de administração com botão de excluir
    function displayAdminProducts() {
        $('#admin-product-list').empty();  // Limpar antes de exibir
        products.forEach(product => {
            $('#admin-product-list').append(`
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">R$ ${product.price.toFixed(2)}</p>
                        <button class="btn btn-danger delete-product" data-id="${product.id}">Excluir</button>
                    </div>
                </div>
            `);
        });
    }

    // Função para limpar o carrinho
    $('#clear-cart').click(function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));  // Limpar o carrinho no LocalStorage
        updateCartCount();
        loadCartItems();
        updateCartTotal();  // Zera o total após limpar o carrinho
    });

    // Inicialização
    displayProducts();  // Exibir produtos ao carregar a página
    updateCartTotal();  // Mostra o valor inicial (R$ 0,00)
    updateCartCount();  // Atualiza a contagem de itens no carrinho

    // Carregar os itens do carrinho e total na página de carrinho
    loadCartItems();
    updateCartTotal();

    // Exibir produtos na página de administração
    displayAdminProducts();
});
