/**
 * Utilidades de diagnóstico para problemas de autenticación
 * Especialmente útil para depurar problemas de cookies en producción
 */

/**
 * Diagnóstico completo del estado de autenticación
 */
export function runAuthDiagnostics() {
  console.log("🔍 === DIAGNÓSTICO DE AUTENTICACIÓN ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Environment:", process.env.NODE_ENV);
  console.log("User Agent:", typeof window !== 'undefined' ? window.navigator.userAgent : 'server');
  console.log("URL:", typeof window !== 'undefined' ? window.location.href : 'server');
  
  // Verificar cookies del navegador
  if (typeof document !== 'undefined') {
    console.log("\n🍪 === COOKIES DEL NAVEGADOR ===");
    const cookies = document.cookie.split(';').map(c => c.trim());
    console.log("Todas las cookies:", cookies);
    
    const authCookie = cookies.find(c => c.startsWith('UNAM-INCLUSION-TOKEN='));
    if (authCookie) {
      const tokenValue = authCookie.split('=')[1];
      console.log("✅ Cookie de autenticación encontrada:", {
        length: tokenValue?.length || 0,
        preview: tokenValue ? `${tokenValue.substring(0, 10)}...` : 'empty',
        full: tokenValue // CUIDADO: Solo para depuración, remover en producción
      });
    } else {
      console.log("❌ Cookie de autenticación NO encontrada");
    }
  }
  
  // Verificar localStorage
  if (typeof localStorage !== 'undefined') {
    console.log("\n💾 === LOCAL STORAGE ===");
    const keys = Object.keys(localStorage);
    console.log("Claves en localStorage:", keys);
    
    keys.forEach(key => {
      if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('token')) {
        console.log(`${key}:`, localStorage.getItem(key)?.substring(0, 50) + '...');
      }
    });
  }
  
  // Verificar sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    console.log("\n🗂️ === SESSION STORAGE ===");
    const keys = Object.keys(sessionStorage);
    console.log("Claves en sessionStorage:", keys);
    
    keys.forEach(key => {
      if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('token')) {
        console.log(`${key}:`, sessionStorage.getItem(key)?.substring(0, 50) + '...');
      }
    });
  }
  
  console.log("\n🔍 === FIN DEL DIAGNÓSTICO ===");
}

/**
 * Verifica la conectividad con el backend
 */
export async function testBackendConnectivity() {
  console.log("🌐 === PRUEBA DE CONECTIVIDAD BACKEND ===");
  
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";
  console.log("Endpoint:", endpoint);
  
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query { __typename }` // Query mínima para probar conectividad
      }),
    });
    
    console.log("✅ Conectividad exitosa:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    const result = await response.json();
    console.log("Respuesta:", result);
    
  } catch (error) {
    console.log("❌ Error de conectividad:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

/**
 * Prueba la autenticación con el token actual
 */
export async function testCurrentAuthentication() {
  console.log("🔐 === PRUEBA DE AUTENTICACIÓN ACTUAL ===");
  
  // Obtener token de las cookies
  let token = null;
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const authCookie = cookies.find(c => c.startsWith('UNAM-INCLUSION-TOKEN='));
    if (authCookie) {
      token = authCookie.split('=')[1];
    }
  }
  
  if (!token) {
    console.log("❌ No se encontró token de autenticación");
    return;
  }
  
  console.log("Token encontrado:", {
    length: token.length,
    preview: `${token.substring(0, 10)}...`
  });
  
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";
  
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query Revalidate {
            revalidate {
              token
              user {
                id
                fullName
                email
                roles
                isActive
              }
            }
          }
        `
      }),
    });
    
    console.log("Respuesta de autenticación:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.log("❌ Errores de GraphQL:", result.errors);
    }
    
    if (result.data?.revalidate?.user) {
      console.log("✅ Usuario autenticado:", {
        id: result.data.revalidate.user.id,
        fullName: result.data.revalidate.user.fullName,
        roles: result.data.revalidate.user.roles,
        isActive: result.data.revalidate.user.isActive
      });
    } else {
      console.log("❌ No se pudo obtener información del usuario");
    }
    
  } catch (error) {
    console.log("❌ Error en la prueba de autenticación:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

/**
 * Ejecuta todos los diagnósticos
 */
export async function runFullDiagnostics() {
  runAuthDiagnostics();
  await testBackendConnectivity();
  await testCurrentAuthentication();
}

// Función global para usar en la consola del navegador
if (typeof window !== 'undefined') {
  (window as any).runAuthDiagnostics = runAuthDiagnostics;
  (window as any).testBackendConnectivity = testBackendConnectivity;
  (window as any).testCurrentAuthentication = testCurrentAuthentication;
  (window as any).runFullDiagnostics = runFullDiagnostics;
  
  console.log("🛠️ Funciones de diagnóstico disponibles en la consola:");
  console.log("- runAuthDiagnostics()");
  console.log("- testBackendConnectivity()");
  console.log("- testCurrentAuthentication()");
  console.log("- runFullDiagnostics()");
}