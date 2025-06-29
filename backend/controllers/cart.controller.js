import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('get cart user id =', userId);

    const cart = await CartModel.findOne({ userId })
      .populate('items.productId')
      .exec();

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    for (const item of cart.items) {
      const quantity = item.quantity;
      const product = item.productId;

      totalQuantity += quantity;
      totalPrice += product.price * quantity;
    }

    console.log('cart details', cart, totalQuantity, totalPrice);
    res.status(200).json({
      message: 'Successfully fetched the cart',
      cart,
      totalPrice,
      totalQuantity
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal Server error' });
  }
};

const addItem = async (req, res) => {
  console.log('cart req', req.user);
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: 'User Id is required' });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const productExists = await ProductModel.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({
        userId,
        items: [{
          productId,
          quantity,
          addedAt: new Date(),
        }],
      });
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          quantity,
          addedAt: new Date(),
        });
      }
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    item.quantity = quantity;
    cart.updatedAt = new Date();
    await cart.save();

    console.log('Quantity updated', cart);
    return res.status(200).json({ message: 'Quantity updated', cart });
  } catch (err) {
    console.error('Error updating quantity:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const updatedCart = await CartModel.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart not found or item not found' });
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    for (const item of updatedCart.items) {
      const quantity = item.quantity;
      const product = item.productId;

      totalQuantity += quantity;
      totalPrice += product.price * quantity;
    }

    res.status(200).json({
      message: 'Item deleted successfully',
      cart: updatedCart,
      totalPrice,
      totalQuantity
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error while deleting cart item' });
  }
};

export {
  addItem,
  getCart,
  updateCartItemQuantity,
  deleteItem
};
