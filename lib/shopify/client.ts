type ShopifyConfig = {
  domain: string;
  storefrontToken: string;
};

export function getShopifyConfig(): ShopifyConfig | null {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !storefrontToken) return null;
  return { domain, storefrontToken };
}

export function isShopifyLive() {
  return getShopifyConfig() !== null;
}

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const config = getShopifyConfig();
  if (!config) throw new Error("Shopify not configured");

  const res = await fetch(`https://${config.domain}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  return json.data as T;
}

const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          tags
          featuredImage { url }
          priceRange {
            minVariantPrice { amount }
          }
          variants(first: 1) {
            edges {
              node { id }
            }
          }
        }
      }
    }
  }
`;

export type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags: string[];
  featuredImage: { url: string } | null;
  priceRange: { minVariantPrice: { amount: string } };
  variants: { edges: { node: { id: string } }[] };
};

export async function fetchShopifyProducts(limit = 20) {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProductNode }[] };
  }>(PRODUCTS_QUERY, { first: limit });
  return data.products.edges.map((e) => e.node);
}

const CART_CREATE = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createShopifyCheckout(
  lines: { merchandiseId: string; quantity: number }[]
) {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(CART_CREATE, {
    input: { lines },
  });

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}