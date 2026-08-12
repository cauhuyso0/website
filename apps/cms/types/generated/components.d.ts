import type { Schema, Struct } from '@strapi/strapi';

export interface HomeCategoryHighlight extends Struct.ComponentSchema {
  collectionName: 'components_home_category_highlights';
  info: {
    displayName: 'Category Highlight';
    icon: 'bulletList';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeCommitment extends Struct.ComponentSchema {
  collectionName: 'components_home_commitments';
  info: {
    displayName: 'Commitment';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_home_hero_slides';
  info: {
    displayName: 'Hero Slide';
    icon: 'picture';
  };
  attributes: {
    ctaHref: Schema.Attribute.String;
    ctaLabel: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface OrderOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_order_order_items';
  info: {
    displayName: 'Order Item';
    icon: 'shoppingCart';
  };
  attributes: {
    lineTotal: Schema.Attribute.Decimal & Schema.Attribute.Required;
    productName: Schema.Attribute.String & Schema.Attribute.Required;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    sku: Schema.Attribute.String;
    unitPrice: Schema.Attribute.Decimal & Schema.Attribute.Required;
    variantName: Schema.Attribute.String;
  };
}

export interface ProductFlavorOption extends Struct.ComponentSchema {
  collectionName: 'components_product_flavor_options';
  info: {
    displayName: 'Ch\u1ECDn v\u1ECB';
    icon: 'cup';
  };
  attributes: {
    isFavorite: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductSweetnessOption extends Struct.ComponentSchema {
  collectionName: 'components_product_sweetness_options';
  info: {
    displayName: '\u0110\u1ED9 ng\u1ECDt';
    icon: 'chartCircle';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductToppingOption extends Struct.ComponentSchema {
  collectionName: 'components_product_topping_options';
  info: {
    displayName: 'Ch\u1ECDn v\u1ECB';
    icon: 'plus';
  };
  attributes: {
    isFavorite: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    priceAddon: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedShowroom extends Struct.ComponentSchema {
  collectionName: 'components_shared_showrooms';
  info: {
    displayName: 'Showroom';
    icon: 'pinMap';
  };
  attributes: {
    address: Schema.Attribute.Text & Schema.Attribute.Required;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    hotline: Schema.Attribute.String;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'instagram', 'youtube', 'zalo', 'tiktok']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'home.category-highlight': HomeCategoryHighlight;
      'home.commitment': HomeCommitment;
      'home.hero-slide': HomeHeroSlide;
      'order.order-item': OrderOrderItem;
      'product.flavor-option': ProductFlavorOption;
      'product.sweetness-option': ProductSweetnessOption;
      'product.topping-option': ProductToppingOption;
      'shared.showroom': SharedShowroom;
      'shared.social-link': SharedSocialLink;
    }
  }
}
