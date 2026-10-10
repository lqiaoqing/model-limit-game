const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three.webgpu-CWtlW6YC.js","assets/three.core-DibAiuSO.js"])))=>i.map(i=>d[i]);
import{$n as e,$r as t,$t as n,B as r,Br as i,C as a,Ct as o,D as s,Dr as c,Dt as l,E as u,Er as d,Et as f,F as p,Ft as m,Gt as h,H as g,Hr as _,Ir as v,It as y,Jt as b,K as x,Kr as S,L as C,Lt as w,M as T,Mr as E,Mt as D,N as O,Nr as k,O as A,Ot as ee,P as te,Pr as ne,Pt as j,Q as re,Qt as M,Rr as ie,Rt as N,S as ae,St as oe,T as P,Tt as se,U as ce,Ur as F,Vr as le,W as ue,Wr as de,X as fe,Xn as pe,Xt as me,Y as I,Yn as he,Yr as L,Yt as ge,Z as _e,Zn as ve,_n as ye,an as be,b as xe,br as Se,bt as Ce,c as R,ci as we,ei as Te,en as Ee,fr as De,g as z,gt as Oe,h as ke,hr as B,ii as Ae,ir as V,it as je,jr as Me,kr as H,l as U,li as W,m as Ne,mr as G,ni as K,nn as q,nr as Pe,oi as Fe,on as Ie,or as Le,p as Re,pn as ze,pr as Be,qr as Ve,qt as He,r as Ue,ri as We,rn as Ge,si as J,sr as Ke,ti as qe,tn as Je,u as Ye,ui as Xe,v as Y,vn as Ze,x as Qe,z as $e,zr as et,zt as tt}from"./three.core-DibAiuSO.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function nt(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function rt(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var X={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Z={common:{diffuse:{value:new z(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new j},alphaMap:{value:null},alphaMapTransform:{value:new j},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new j}},envmap:{envMap:{value:null},envMapRotation:{value:new j},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new j}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new j}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new j},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new j},normalScale:{value:new _(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new j},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new j}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new j}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new j}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new z(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new F},probesMax:{value:new F},probesResolution:{value:new F}},points:{diffuse:{value:new z(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new j},alphaTest:{value:0},uvTransform:{value:new j}},sprite:{diffuse:{value:new z(16777215)},opacity:{value:1},center:{value:new _(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new j},alphaMap:{value:null},alphaMapTransform:{value:new j},alphaTest:{value:0}}},it={basic:{uniforms:J([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:X.meshbasic_vert,fragmentShader:X.meshbasic_frag},lambert:{uniforms:J([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new z(0)},envMapIntensity:{value:1}}]),vertexShader:X.meshlambert_vert,fragmentShader:X.meshlambert_frag},phong:{uniforms:J([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new z(0)},specular:{value:new z(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:X.meshphong_vert,fragmentShader:X.meshphong_frag},standard:{uniforms:J([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new z(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag},toon:{uniforms:J([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new z(0)}}]),vertexShader:X.meshtoon_vert,fragmentShader:X.meshtoon_frag},matcap:{uniforms:J([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:X.meshmatcap_vert,fragmentShader:X.meshmatcap_frag},points:{uniforms:J([Z.points,Z.fog]),vertexShader:X.points_vert,fragmentShader:X.points_frag},dashed:{uniforms:J([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:X.linedashed_vert,fragmentShader:X.linedashed_frag},depth:{uniforms:J([Z.common,Z.displacementmap]),vertexShader:X.depth_vert,fragmentShader:X.depth_frag},normal:{uniforms:J([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:X.meshnormal_vert,fragmentShader:X.meshnormal_frag},sprite:{uniforms:J([Z.sprite,Z.fog]),vertexShader:X.sprite_vert,fragmentShader:X.sprite_frag},background:{uniforms:{uvTransform:{value:new j},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:X.background_vert,fragmentShader:X.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new j}},vertexShader:X.backgroundCube_vert,fragmentShader:X.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:X.cube_vert,fragmentShader:X.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:X.equirect_vert,fragmentShader:X.equirect_frag},distance:{uniforms:J([Z.common,Z.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:X.distance_vert,fragmentShader:X.distance_frag},shadow:{uniforms:J([Z.lights,Z.fog,{color:{value:new z(0)},opacity:{value:1}}]),vertexShader:X.shadow_vert,fragmentShader:X.shadow_frag}};it.physical={uniforms:J([it.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new j},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new j},clearcoatNormalScale:{value:new _(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new j},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new j},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new j},sheen:{value:0},sheenColor:{value:new z(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new j},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new j},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new j},transmissionSamplerSize:{value:new _},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new j},attenuationDistance:{value:0},attenuationColor:{value:new z(0)},specularColor:{value:new z(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new j},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new j},anisotropyVector:{value:new _},anisotropyMap:{value:null},anisotropyMapTransform:{value:new j}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag};var at={r:0,b:0,g:0},ot=new m,st=new j;st.set(-1,0,0,0,1,0,0,0,1);function ct(e,n,r,i,a,o){let s=new z(0),c=a===!0?0:1,l,u,d=null,f=0,p=null;function m(e){let t=e.isScene===!0?e.background:null;if(t&&t.isTexture){let r=e.backgroundBlurriness>0;t=n.get(t,r)}return t}function h(t){let n=!1,i=m(t);i===null?_(s,c):i&&i.isColor&&(_(i,1),n=!0);let a=e.xr.getEnvironmentBlendMode();a===`additive`?r.buffers.color.setClear(0,0,0,1,o):a===`alpha-blend`&&r.buffers.color.setClear(0,0,0,0,o),(e.autoClear||n)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function g(n,r){let a=m(r);a&&(a.isCubeTexture||a.mapping===306)?(u===void 0&&(u=new y(new R(1,1,1),new B({name:`BackgroundCubeMaterial`,uniforms:t(it.backgroundCube.uniforms),vertexShader:it.backgroundCube.vertexShader,fragmentShader:it.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),u.material.uniforms.envMap.value=a,u.material.uniforms.backgroundBlurriness.value=r.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=r.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(ot.makeRotationFromEuler(r.backgroundRotation)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&u.material.uniforms.backgroundRotation.value.premultiply(st),u.material.toneMapped=Y.getTransfer(a.colorSpace)!==Be,(d!==a||f!==a.version||p!==e.toneMapping)&&(u.material.needsUpdate=!0,d=a,f=a.version,p=e.toneMapping),u.layers.enableAll(),n.unshift(u,u.geometry,u.material,0,0,null)):a&&a.isTexture&&(l===void 0&&(l=new y(new Ge(2,2),new B({name:`BackgroundMaterial`,uniforms:t(it.background.uniforms),vertexShader:it.background.vertexShader,fragmentShader:it.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=a,l.material.uniforms.backgroundIntensity.value=r.backgroundIntensity,l.material.toneMapped=Y.getTransfer(a.colorSpace)!==Be,a.matrixAutoUpdate===!0&&a.updateMatrix(),l.material.uniforms.uvTransform.value.copy(a.matrix),(d!==a||f!==a.version||p!==e.toneMapping)&&(l.material.needsUpdate=!0,d=a,f=a.version,p=e.toneMapping),l.layers.enableAll(),n.unshift(l,l.geometry,l.material,0,0,null))}function _(t,n){t.getRGB(at,Ae(e)),r.buffers.color.setClear(at.r,at.g,at.b,n,o)}function v(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return s},setClearColor:function(e,t=1){s.set(e),c=t,_(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(e){c=e,_(s,c)},render:h,addToRenderList:g,dispose:v}}function lt(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function ut(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function dt(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&n!==1015&&!i)}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(W(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&W(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function ft(e){let t=this,n=null,r=0,i=!1,a=!1,o=new q,s=new j,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var pt=4,mt=[.125,.215,.35,.446,.526,.582],ht=20,gt=256,_t=new Ee,vt=new z,yt=null,bt=0,xt=0,St=!1,Ct=new F,wt=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Ct}=i;yt=this._renderer.getRenderTarget(),bt=this._renderer.getActiveCubeFace(),xt=this._renderer.getActiveMipmapLevel(),St=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jt(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=At(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(yt,bt,xt),this._renderer.xr.enabled=St,e.scissorTest=!1,Dt(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),yt=this._renderer.getRenderTarget(),bt=this._renderer.getActiveCubeFace(),xt=this._renderer.getActiveMipmapLevel(),St=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:o,minFilter:o,generateMipmaps:!1,type:fe,format:ye,colorSpace:l,depthBuffer:!1},r=Et(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Et(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Tt(r)),this._blurMaterial=kt(r,e,t),this._ggxMaterial=Ot(r,e,t)}return r}_compileMaterial(e){let t=new y(new Ye,e);this._renderer.compile(t,_t)}_sceneToCubeUV(e,t,n,r,i){let a=new Je(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(vt),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new y(new R,new w({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(vt),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Dt(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=jt()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=At());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Dt(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,_t)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-pt?n-d+pt:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Dt(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,_t),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Dt(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,_t)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,t,n,r,i,a,o){let s=this._renderer,c=this._blurMaterial;a!==`latitudinal`&&a!==`longitudinal`&&K(`blur direction must be either latitudinal or longitudinal!`);let l=this._lodMeshes[r];l.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,f=isFinite(i)?Math.PI/(2*d):2*Math.PI/39,p=i/f,m=isFinite(i)?1+Math.floor(3*p):ht;m>ht&&W(`sigmaRadians, ${i}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ht}`);let h=[],g=0;for(let e=0;e<ht;++e){let t=e/p,n=Math.exp(-t*t/2);h.push(n),e===0?g+=n:e<m&&(g+=2*n)}for(let e=0;e<h.length;e++)h[e]=h[e]/g;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=h,u.latitudinal.value=a===`latitudinal`,o&&(u.poleAxis.value=o);let{_lodMax:_}=this;u.dTheta.value=f,u.mipInt.value=_-n;let v=this._sizeLods[r];Dt(t,3*v*(r>_-pt?r-_+pt:0),4*(this._cubeSize-v),3*v,2*v),s.setRenderTarget(t),s.render(l,_t)}};function Tt(e){let t=[],n=[],r=[],i=e,a=e-pt+1+mt.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-pt?s=mt[o-e+pt-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new Ye;h.setAttribute(`position`,new U(f,3)),h.setAttribute(`uv`,new U(p,2)),h.setAttribute(`faceIndex`,new U(m,1)),r.push(new y(h,null)),i>pt&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function Et(e,t,n){let r=new Ve(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Dt(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Ot(e,t,n){return new B({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:gt,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Mt(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function kt(e,t,n){let r=new Float32Array(ht),i=new F(0,1,0);return new B({name:`SphericalGaussianBlur`,defines:{n:ht,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Mt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function At(){return new B({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Mt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function jt(){return new B({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Mt(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Nt=class extends Ve{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new a(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new R(5,5,5),a=new B({name:`CubemapFromEquirect`,uniforms:t(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:1,blending:0});a.uniforms.tEquirect.value=n;let s=new y(i,a),c=n.minFilter;return n.minFilter===1008&&(n.minFilter=o),new Qe(1,10,this).update(e,s),n.minFilter=c,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Pt(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Nt(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new wt(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new wt(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Ft(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Xe(`WebGLRenderer: `+e+` extension not supported.`),t}}}function It(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?E:Me)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Lt(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Rt(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:K(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function zt(e,t,n){let r=new WeakMap,i=new de;function a(a,o,c){let l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u===void 0?0:u.length,f=r.get(o);if(f===void 0||f.count!==d){f!==void 0&&f.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,c=o.morphAttributes.position||[],l=o.morphAttributes.normal||[],u=o.morphAttributes.color||[],p=0;e===!0&&(p=1),n===!0&&(p=2),a===!0&&(p=3);let m=o.attributes.position.count*p,h=1;m>t.maxTextureSize&&(h=Math.ceil(m/t.maxTextureSize),m=t.maxTextureSize);let g=new Float32Array(m*h*4*d),v=new s(g,m,h,d);v.type=ce,v.needsUpdate=!0;let y=p*4;for(let t=0;t<d;t++){let r=c[t],o=l[t],s=u[t],d=m*h*4*t;for(let t=0;t<r.count;t++){let c=t*y;e===!0&&(i.fromBufferAttribute(r,t),g[d+c+0]=i.x,g[d+c+1]=i.y,g[d+c+2]=i.z,g[d+c+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+c+4]=i.x,g[d+c+5]=i.y,g[d+c+6]=i.z,g[d+c+7]=0),a===!0&&(i.fromBufferAttribute(s,t),g[d+c+8]=i.x,g[d+c+9]=i.y,g[d+c+10]=i.z,g[d+c+11]=s.itemSize===4?i.w:1)}}f={count:d,texture:v,size:new _(m,h)},r.set(o,f);function b(){v.dispose(),r.delete(o),o.removeEventListener(`dispose`,b)}o.addEventListener(`dispose`,b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<l.length;e++)t+=l[e];let n=o.morphTargetsRelative?1:1-t;c.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),c.getUniforms().setValue(e,`morphTargetInfluences`,l)}c.getUniforms().setValue(e,`morphTargetsTexture`,f.texture,n),c.getUniforms().setValue(e,`morphTargetsTextureSize`,f.size)}return{update:a}}function Bt(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Vt={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Ht(e,t,n,r,i){let a=new Ve(t,n,{type:e,depthBuffer:r,stencilBuffer:i,depthTexture:r?new te(t,n):void 0}),o=new Ve(t,n,{type:fe,depthBuffer:!1,stencilBuffer:!1}),s=new Ye;s.setAttribute(`position`,new g([-1,3,0,-1,-1,0,3,-1,0],3)),s.setAttribute(`uv`,new g([0,2,0,0,2,0],2));let c=new ve({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new y(s,c),u=new Ee(-1,1,1,-1,0,1),d=null,f=null,p=!1,m,h=null,_=[],v=!1;this.setSize=function(e,t){a.setSize(e,t),o.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,v=_.length>0&&_[0].isRenderPass===!0;let t=a.width,n=a.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(p||e.toneMapping===0&&_.length===0)return!1;if(h=t,t!==null){let e=t.width,n=t.height;(a.width!==e||a.height!==n)&&this.setSize(e,n)}return v===!1&&e.setRenderTarget(a),m=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return v},this.end=function(e,t){e.toneMapping=m,p=!0;let n=a,r=o;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(d!==e.outputColorSpace||f!==e.toneMapping){d=e.outputColorSpace,f=e.toneMapping,c.defines={},Y.getTransfer(d)===`srgb`&&(c.defines.SRGB_TRANSFER=``);let t=Vt[f];t&&(c.defines[t]=``),c.needsUpdate=!0}c.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(h),e.render(l,u),h=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),s.dispose(),c.dispose()}}var Ut=new d,Wt=new te(1,1),Gt=new s,Kt=new u,qt=new a,Jt=[],Yt=[],Xt=new Float32Array(16),Zt=new Float32Array(9),Qt=new Float32Array(4);function $t(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Jt[i];if(a===void 0&&(a=new Float32Array(i),Jt[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function en(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function tn(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function nn(e,t){let n=Yt[t];n===void 0&&(n=new Int32Array(t),Yt[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function rn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function an(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(en(n,t))return;e.uniform2fv(this.addr,t),tn(n,t)}}function on(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(en(n,t))return;e.uniform3fv(this.addr,t),tn(n,t)}}function sn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(en(n,t))return;e.uniform4fv(this.addr,t),tn(n,t)}}function cn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(en(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),tn(n,t)}else{if(en(n,r))return;Qt.set(r),e.uniformMatrix2fv(this.addr,!1,Qt),tn(n,r)}}function ln(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(en(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),tn(n,t)}else{if(en(n,r))return;Zt.set(r),e.uniformMatrix3fv(this.addr,!1,Zt),tn(n,r)}}function un(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(en(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),tn(n,t)}else{if(en(n,r))return;Xt.set(r),e.uniformMatrix4fv(this.addr,!1,Xt),tn(n,r)}}function dn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function fn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(en(n,t))return;e.uniform2iv(this.addr,t),tn(n,t)}}function pn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(en(n,t))return;e.uniform3iv(this.addr,t),tn(n,t)}}function mn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(en(n,t))return;e.uniform4iv(this.addr,t),tn(n,t)}}function hn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function gn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(en(n,t))return;e.uniform2uiv(this.addr,t),tn(n,t)}}function _n(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(en(n,t))return;e.uniform3uiv(this.addr,t),tn(n,t)}}function vn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(en(n,t))return;e.uniform4uiv(this.addr,t),tn(n,t)}}function yn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Wt.compareFunction=n.isReversedDepthBuffer()?518:515,a=Wt):a=Ut,n.setTexture2D(t||a,i)}function bn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Kt,i)}function xn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||qt,i)}function Sn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Gt,i)}function Cn(e){switch(e){case 5126:return rn;case 35664:return an;case 35665:return on;case 35666:return sn;case 35674:return cn;case 35675:return ln;case 35676:return un;case 5124:case 35670:return dn;case 35667:case 35671:return fn;case 35668:case 35672:return pn;case 35669:case 35673:return mn;case 5125:return hn;case 36294:return gn;case 36295:return _n;case 36296:return vn;case 35678:case 36198:case 36298:case 36306:case 35682:return yn;case 35679:case 36299:case 36307:return bn;case 35680:case 36300:case 36308:case 36293:return xn;case 36289:case 36303:case 36311:case 36292:return Sn}}function wn(e,t){e.uniform1fv(this.addr,t)}function Tn(e,t){let n=$t(t,this.size,2);e.uniform2fv(this.addr,n)}function En(e,t){let n=$t(t,this.size,3);e.uniform3fv(this.addr,n)}function Dn(e,t){let n=$t(t,this.size,4);e.uniform4fv(this.addr,n)}function On(e,t){let n=$t(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function kn(e,t){let n=$t(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function An(e,t){let n=$t(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function jn(e,t){e.uniform1iv(this.addr,t)}function Mn(e,t){e.uniform2iv(this.addr,t)}function Nn(e,t){e.uniform3iv(this.addr,t)}function Pn(e,t){e.uniform4iv(this.addr,t)}function Fn(e,t){e.uniform1uiv(this.addr,t)}function In(e,t){e.uniform2uiv(this.addr,t)}function Ln(e,t){e.uniform3uiv(this.addr,t)}function Rn(e,t){e.uniform4uiv(this.addr,t)}function zn(e,t,n){let r=this.cache,i=t.length,a=nn(n,i);en(r,a)||(e.uniform1iv(this.addr,a),tn(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Wt:Ut;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Bn(e,t,n){let r=this.cache,i=t.length,a=nn(n,i);en(r,a)||(e.uniform1iv(this.addr,a),tn(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Kt,a[e])}function Vn(e,t,n){let r=this.cache,i=t.length,a=nn(n,i);en(r,a)||(e.uniform1iv(this.addr,a),tn(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||qt,a[e])}function Hn(e,t,n){let r=this.cache,i=t.length,a=nn(n,i);en(r,a)||(e.uniform1iv(this.addr,a),tn(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Gt,a[e])}function Un(e){switch(e){case 5126:return wn;case 35664:return Tn;case 35665:return En;case 35666:return Dn;case 35674:return On;case 35675:return kn;case 35676:return An;case 5124:case 35670:return jn;case 35667:case 35671:return Mn;case 35668:case 35672:return Nn;case 35669:case 35673:return Pn;case 5125:return Fn;case 36294:return In;case 36295:return Ln;case 36296:return Rn;case 35678:case 36198:case 36298:case 36306:case 35682:return zn;case 35679:case 36299:case 36307:return Bn;case 35680:case 36300:case 36308:case 36293:return Vn;case 36289:case 36303:case 36311:case 36292:return Hn}}var Wn=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Cn(t.type)}},Gn=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Un(t.type)}},Kn=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},qn=/(\w+)(\])?(\[|\.)?/g;function Jn(e,t){e.seq.push(t),e.map[t.id]=t}function Yn(e,t,n){let r=e.name,i=r.length;for(qn.lastIndex=0;;){let a=qn.exec(r),o=qn.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Jn(n,l===void 0?new Wn(s,e,t):new Gn(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Kn(s),Jn(n,e)),n=e}}}var Xn=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Yn(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Zn(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Qn=37297,$n=0;function er(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var tr=new j;function nr(e){Y._getMatrix(tr,Y.workingColorSpace,e);let t=`mat3( ${tr.elements.map(e=>e.toFixed(4))} )`;switch(Y.getTransfer(e)){case ee:return[t,`LinearTransferOETF`];case Be:return[t,`sRGBTransferOETF`];default:return W(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function rr(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+er(e.getShaderSource(t),r)}return i}function ir(e,t){let n=nr(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var ar={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function or(e,t){let n=ar[t];return n===void 0?(W(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var sr=new F;function cr(){return Y.getLuminanceCoefficients(sr),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${sr.x.toFixed(4)}, ${sr.y.toFixed(4)}, ${sr.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function lr(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(fr).join(`
`)}function ur(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function dr(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function fr(e){return e!==``}function pr(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function mr(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var hr=/^[ \t]*#include +<([\w\d./]+)>/gm;function gr(e){return e.replace(hr,vr)}var _r=new Map;function vr(e,t){let n=X[t];if(n===void 0){let e=_r.get(t);if(e!==void 0)n=X[e],W(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`Can not resolve #include <`+t+`>`)}return gr(n)}var yr=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function br(e){return e.replace(yr,xr)}function xr(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Sr(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Cr={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function wr(e){return Cr[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Tr={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Er(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Tr[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Dr={302:`ENVMAP_MODE_REFRACTION`};function Or(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Dr[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var kr={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Ar(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:kr[e.combine]||`ENVMAP_BLENDING_NONE`}function jr(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Mr(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=wr(n),l=Er(n),u=Or(n),d=Ar(n),f=jr(n),p=lr(n),m=ur(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(fr).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(fr).join(`
`),_.length>0&&(_+=`
`)):(g=[Sr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(fr).join(`
`),_=[Sr(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:X.tonemapping_pars_fragment,n.toneMapping===0?``:or(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,X.colorspace_pars_fragment,ir(`linearToOutputTexel`,n.outputColorSpace),cr(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(fr).join(`
`)),o=gr(o),o=pr(o,n),o=mr(o,n),s=gr(s),s=pr(s,n),s=mr(s,n),o=br(o),s=br(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Zn(i,i.VERTEX_SHADER,y),S=Zn(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.morphTargets===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=rr(i,x,`vertex`),n=rr(i,S,`fragment`);K(`THREE.WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):W(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Xn(i,h),T=dr(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Qn)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=$n++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Nr=0,Pr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Fr(e),t.set(e,n)),n}},Fr=class{constructor(e){this.id=Nr++,this.code=e,this.usedTimes=0}};function Ir(e){return e===1030||e===37490||e===36285}function Lr(e,t,n,r,i,a){let o=new Oe,s=new Pr,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&W(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=it[C];D=e.vertexShader,O=e.fragmentShader}else D=i.vertexShader,O=i.fragmentShader,s.update(i),k=s.getVertexShaderID(i),A=s.getFragmentShaderID(i);let ee=e.getRenderTarget(),te=e.state.buffers.depth.getReversed(),ne=h.isInstancedMesh===!0,j=h.isBatchedMesh===!0,re=!!i.map,M=!!i.matcap,ie=!!x,N=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap,P=!!i.normalMap,se=!!i.displacementMap,ce=!!i.emissiveMap,F=!!i.metalnessMap,le=!!i.roughnessMap,ue=i.anisotropy>0,de=i.clearcoat>0,fe=i.dispersion>0,pe=i.iridescence>0,me=i.sheen>0,I=i.transmission>0,he=ue&&!!i.anisotropyMap,L=de&&!!i.clearcoatMap,ge=de&&!!i.clearcoatNormalMap,_e=de&&!!i.clearcoatRoughnessMap,ve=pe&&!!i.iridescenceMap,ye=pe&&!!i.iridescenceThicknessMap,be=me&&!!i.sheenColorMap,xe=me&&!!i.sheenRoughnessMap,Se=!!i.specularMap,Ce=!!i.specularColorMap,R=!!i.specularIntensityMap,we=I&&!!i.transmissionMap,Te=I&&!!i.thicknessMap,Ee=!!i.gradientMap,De=!!i.alphaMap,z=i.alphaTest>0,Oe=!!i.alphaHash,ke=!!i.extensions,B=0;i.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(B=e.toneMapping);let Ae={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:j,batchingColor:j&&h._colorsTexture!==null,instancing:ne,instancingColor:ne&&h.instanceColor!==null,instancingMorph:ne&&h.morphTexture!==null,outputColorSpace:ee===null?e.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Y.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:re,matcap:M,envMap:ie,envMapMode:ie&&x.mapping,envMapCubeUVHeight:S,aoMap:N,lightMap:ae,bumpMap:oe,normalMap:P,displacementMap:se,emissiveMap:ce,normalMapObjectSpace:P&&i.normalMapType===1,normalMapTangentSpace:P&&i.normalMapType===0,packedNormalMap:P&&i.normalMapType===0&&Ir(i.normalMap.format),metalnessMap:F,roughnessMap:le,anisotropy:ue,anisotropyMap:he,clearcoat:de,clearcoatMap:L,clearcoatNormalMap:ge,clearcoatRoughnessMap:_e,dispersion:fe,iridescence:pe,iridescenceMap:ve,iridescenceThicknessMap:ye,sheen:me,sheenColorMap:be,sheenRoughnessMap:xe,specularMap:Se,specularColorMap:Ce,specularIntensityMap:R,transmission:I,transmissionMap:we,thicknessMap:Te,gradientMap:Ee,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:De,alphaTest:z,alphaHash:Oe,combine:i.combine,mapUv:re&&m(i.map.channel),aoMapUv:N&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:P&&m(i.normalMap.channel),displacementMapUv:se&&m(i.displacementMap.channel),emissiveMapUv:ce&&m(i.emissiveMap.channel),metalnessMapUv:F&&m(i.metalnessMap.channel),roughnessMapUv:le&&m(i.roughnessMap.channel),anisotropyMapUv:he&&m(i.anisotropyMap.channel),clearcoatMapUv:L&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ge&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_e&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:be&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:xe&&m(i.sheenRoughnessMap.channel),specularMapUv:Se&&m(i.specularMap.channel),specularColorMapUv:Ce&&m(i.specularColorMap.channel),specularIntensityMapUv:R&&m(i.specularIntensityMap.channel),transmissionMapUv:we&&m(i.transmissionMap.channel),thicknessMapUv:Te&&m(i.thicknessMap.channel),alphaMapUv:De&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(P||ue),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(re||De),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&P===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:te,skinning:h.isSkinnedMesh===!0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:B,decodeVideoTexture:re&&i.map.isVideoTexture===!0&&Y.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ce&&i.emissiveMap.isVideoTexture===!0&&Y.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:ke&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(ke&&i.extensions.multiDraw===!0||j)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ae.vertexUv1s=c.has(1),Ae.vertexUv2s=c.has(2),Ae.vertexUv3s=c.has(3),c.clear(),Ae}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=it[t];n=k.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Mr(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Rr(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function zr(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Br(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Vr(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||zr),r.length>1&&r.sort(t||Br),i.length>1&&i.sort(t||Br)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Hr(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Vr,e.set(t,[i])):n>=r.length?(i=new Vr,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Ur(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new F,color:new z};break;case`SpotLight`:n={position:new F,direction:new F,color:new z,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new F,color:new z,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new F,skyColor:new z,groundColor:new z};break;case`RectAreaLight`:n={color:new z,position:new F,halfWidth:new F,halfHeight:new F}}return e[t.id]=n,n}}}function Wr(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Gr=0;function Kr(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function qr(e){let t=new Ur,n=Wr(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new F);let i=new F,a=new m,o=new m;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(Kr);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Z.LTC_FLOAT_1,r.rectAreaLTC2=Z.LTC_FLOAT_2):(r.rectAreaLTC1=Z.LTC_HALF_1,r.rectAreaLTC2=Z.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=Gr++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function Jr(e){let t=new qr(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Yr(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Jr(e),t.set(n,[a])):r>=i.length?(a=new Jr(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Xr=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Zr=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Qr=[new F(1,0,0),new F(-1,0,0),new F(0,1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1)],$r=[new F(0,-1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1),new F(0,-1,0),new F(0,-1,0)],ei=new m,ti=new F,ni=new F;function ri(e,t,n){let r=new x,i=new _,a=new _,s=new de,c=new N,l=new tt,u={},d=n.maxTextureSize,f={0:1,1:0,2:2},p=new B({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _},radius:{value:4}},vertexShader:Xr,fragmentShader:Zr}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let h=new Ye;h.setAttribute(`position`,new U(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let g=new y(h,p),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,c){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||t.length===0)return;this.type===2&&(W(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let l=e.getRenderTarget(),u=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.state;p.setBlending(0),p.buffers.depth.getReversed()===!0?p.buffers.color.setClear(0,0,0,0):p.buffers.color.setClear(1,1,1,1),p.buffers.depth.setTest(!0),p.setScissorTest(!1);let m=S!==this.type;m&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let l=0,u=t.length;l<u;l++){let u=t[l],f=u.shadow;if(f===void 0){W(`WebGLShadowMap:`,u,`has no shadow.`);continue}if(f.autoUpdate===!1&&f.needsUpdate===!1)continue;i.copy(f.mapSize);let h=f.getFrameExtents();i.multiply(h),a.copy(f.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(a.x=Math.floor(d/h.x),i.x=a.x*h.x,f.mapSize.x=a.x),i.y>d&&(a.y=Math.floor(d/h.y),i.y=a.y*h.y,f.mapSize.y=a.y));let g=e.state.buffers.depth.getReversed();if(f.camera._reversedDepth=g,f.map===null||m===!0){if(f.map!==null&&(f.map.depthTexture!==null&&(f.map.depthTexture.dispose(),f.map.depthTexture=null),f.map.dispose()),this.type===3){if(u.isPointLight){W(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}f.map=new Ve(i.x,i.y,{format:he,type:fe,minFilter:o,magFilter:o,generateMipmaps:!1}),f.map.texture.name=u.name+`.shadowMap`,f.map.depthTexture=new te(i.x,i.y,ce),f.map.depthTexture.name=u.name+`.shadowMapDepth`,f.map.depthTexture.format=T,f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=b,f.map.depthTexture.magFilter=b}else u.isPointLight?(f.map=new Nt(i.x),f.map.depthTexture=new ae(i.x,ie)):(f.map=new Ve(i.x,i.y),f.map.depthTexture=new te(i.x,i.y,ie)),f.map.depthTexture.name=u.name+`.shadowMap`,f.map.depthTexture.format=T,this.type===1?(f.map.depthTexture.compareFunction=g?518:515,f.map.depthTexture.minFilter=o,f.map.depthTexture.magFilter=o):(f.map.depthTexture.compareFunction=null,f.map.depthTexture.minFilter=b,f.map.depthTexture.magFilter=b);f.camera.updateProjectionMatrix()}let _=f.map.isWebGLCubeRenderTarget?6:1;for(let t=0;t<_;t++){if(f.map.isWebGLCubeRenderTarget)e.setRenderTarget(f.map,t),e.clear();else{t===0&&(e.setRenderTarget(f.map),e.clear());let n=f.getViewport(t);s.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),p.viewport(s)}if(u.isPointLight){let e=f.camera,n=f.matrix,r=u.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),ti.setFromMatrixPosition(u.matrixWorld),e.position.copy(ti),ni.copy(e.position),ni.add(Qr[t]),e.up.copy($r[t]),e.lookAt(ni),e.updateMatrixWorld(),n.makeTranslation(-ti.x,-ti.y,-ti.z),ei.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),f._frustum.setFromProjectionMatrix(ei,e.coordinateSystem,e.reversedDepth)}else f.updateMatrices(u);r=f.getFrustum(),E(n,c,f.camera,u,this.type)}f.isPointLightShadow!==!0&&this.type===3&&C(f,c),f.needsUpdate=!1}S=this.type,v.needsUpdate=!1,e.setRenderTarget(l,u,f)};function C(n,r){let a=t.update(g);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null&&(n.mapPass=new Ve(i.x,i.y,{format:he,type:fe})),p.uniforms.shadow_pass.value=n.map.depthTexture,p.uniforms.resolution.value=n.mapSize,p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,p,g,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value=n.mapSize,m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,m,g,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?l:c,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=u[e];r===void 0&&(r={},u[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?f[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function E(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||r.intersectsObject(n))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)E(c[e],i,a,o,s)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in u){let n=u[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function ii(e,t){function n(){let t=!1,n=new de,r=null,i=new de(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?F(e.DEPTH_TEST):le(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=Le[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?F(e.STENCIL_TEST):le(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new z(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,te=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ne=!1,j=0,re=e.getParameter(e.VERSION);re.indexOf(`WebGL`)===-1?re.indexOf(`OpenGL ES`)!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(re)[1]),ne=j>=2):(j=parseFloat(/^WebGL (\d)/.exec(re)[1]),ne=j>=1);let M=null,ie={},N=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new de().fromArray(N),P=new de().fromArray(ae);function se(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ce={};ce[e.TEXTURE_2D]=se(e.TEXTURE_2D,e.TEXTURE_2D,1),ce[e.TEXTURE_CUBE_MAP]=se(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[e.TEXTURE_2D_ARRAY]=se(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ce[e.TEXTURE_3D]=se(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),F(e.DEPTH_TEST),o.setFunc(3),ge(!1),_e(1),F(e.CULL_FACE),he(0);function F(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function le(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function fe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function pe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let me={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};me[103]=e.MIN,me[104]=e.MAX;let I={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function he(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(le(e.BLEND),g=!1);return}if(g===!1&&(F(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:K(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:K(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:K(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:K(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(me[n],me[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(I[r],I[i],I[o],I[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function L(t,n){t.side===2?le(e.CULL_FACE):F(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ge(r),t.blending===1&&t.transparent===!1?he(0):he(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?F(e.SAMPLE_ALPHA_TO_COVERAGE):le(e.SAMPLE_ALPHA_TO_COVERAGE)}function ge(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function _e(t){t===0?le(e.CULL_FACE):(F(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ve(t){t!==k&&(ne&&e.lineWidth(t),k=t)}function ye(t,n,r){t?(F(e.POLYGON_OFFSET_FILL),(A!==n||ee!==r)&&(A=n,ee=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):le(e.POLYGON_OFFSET_FILL)}function be(t){t?F(e.SCISSOR_TEST):le(e.SCISSOR_TEST)}function xe(t){t===void 0&&(t=e.TEXTURE0+te-1),M!==t&&(e.activeTexture(t),M=t)}function Se(t,n,r){r===void 0&&(r=M===null?e.TEXTURE0+te-1:M);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(M!==r&&(e.activeTexture(r),M=r),e.bindTexture(t,n||ce[t]),i.type=t,i.texture=n)}function Ce(){let t=ie[M];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function R(){try{e.compressedTexImage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function we(){try{e.compressedTexImage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function Te(){try{e.texSubImage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function Ee(){try{e.texSubImage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function De(){try{e.compressedTexSubImage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function Oe(){try{e.compressedTexSubImage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function ke(){try{e.texStorage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function B(){try{e.texStorage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function Ae(){try{e.texImage2D(...arguments)}catch(e){K(`WebGLState:`,e)}}function V(){try{e.texImage3D(...arguments)}catch(e){K(`WebGLState:`,e)}}function je(t){return d[t]===void 0?e.getParameter(t):d[t]}function Me(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function H(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function U(t){P.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),P.copy(t))}function W(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ne(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function G(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},M=null,ie={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new z(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,oe.set(0,0,e.canvas.width,e.canvas.height),P.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:F,disable:le,bindFramebuffer:ue,drawBuffers:fe,useProgram:pe,setBlending:he,setMaterial:L,setFlipSided:ge,setCullFace:_e,setLineWidth:ve,setPolygonOffset:ye,setScissorTest:be,activeTexture:xe,bindTexture:Se,unbindTexture:Ce,compressedTexImage2D:R,compressedTexImage3D:we,texImage2D:Ae,texImage3D:V,pixelStorei:Me,getParameter:je,updateUBOMapping:W,uniformBlockBinding:Ne,texStorage2D:ke,texStorage3D:B,texSubImage2D:Te,texSubImage3D:Ee,compressedTexSubImage2D:De,compressedTexSubImage3D:Oe,scissor:H,viewport:U,reset:G}}function ai(e,t,n,r,i,a,s){let c=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,l=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),u=new _,d=new WeakMap,p=new Set,m,h=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function v(e,t){return g?new OffscreenCanvas(e,t):qe(`canvas`)}function y(e,t,n){let r=1,i=Ae(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);m===void 0&&(m=v(n,a));let o=t?v(n,a):m;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),W(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&W(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function x(e){return e.generateMipmaps}function S(t){e.generateMipmap(t)}function C(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function w(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];W(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||W(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?ee:Y.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function T(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,W(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function E(e,t){return x(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function D(e){let t=e.target;t.removeEventListener(`dispose`,D),A(t),t.isVideoTexture&&d.delete(t),t.isHTMLTexture&&p.delete(t)}function k(e){let t=e.target;t.removeEventListener(`dispose`,k),ne(t)}function A(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=h.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&te(e),Object.keys(i).length===0&&h.delete(n)}r.remove(e)}function te(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=h.get(i);delete a[n.__cacheKey],s.memory.textures--}function ne(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),s.memory.textures--),r.remove(i[t])}r.remove(t)}let j=0;function re(){j=0}function M(){return j}function ie(e){j=e}function N(){let e=j;return e>=i.maxTextures&&W(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+i.maxTextures),j+=1,e}function ae(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function oe(t,i){let a=r.get(t);if(t.isVideoTexture&&Oe(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)W(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)W(`WebGLRenderer: Texture marked for update but image is incomplete`);else{L(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function P(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){L(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function ce(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){L(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function F(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){_e(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let le={[V]:e.REPEAT,[ke]:e.CLAMP_TO_EDGE,[He]:e.MIRRORED_REPEAT},ue={[b]:e.NEAREST,[me]:e.NEAREST_MIPMAP_NEAREST,[ge]:e.NEAREST_MIPMAP_LINEAR,[o]:e.LINEAR,[f]:e.LINEAR_MIPMAP_NEAREST,[se]:e.LINEAR_MIPMAP_LINEAR},de={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function fe(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&W(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,le[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,le[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,le[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ue[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ue[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,de[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function pe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D));let i=n.source,a=h.get(i);a===void 0&&(a={},h.set(i,a));let o=ae(n);if(o!==t.__cacheKey){a[o]===void 0&&(a[o]={texture:e.createTexture(),usedTimes:0},s.memory.textures++,r=!0),a[o].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&te(n)),t.__cacheKey=o,t.__webglTexture=a[o].texture}return r}function I(e,t,n){return Math.floor(Math.floor(e/n)/t)}function he(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=I(n.start,r.width,4),c=I(t.start,r.width,4);n.start<=i+1&&a===c&&I(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function L(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=pe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let d=r.get(u);if(u.version!==d.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Y.getPrimaries(Y.workingColorSpace),r=o.colorSpace===``?null:Y.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=y(o.image,!1,i.maxTextureSize);t=B(o,t);let r=a.convert(o.format,o.colorSpace),f=a.convert(o.type),m=w(o.internalFormat,r,f,o.normalized,o.colorSpace,o.isVideoTexture);fe(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,v=d.__version===void 0||l===!0,b=u.dataReady,C=E(o,t);if(o.isDepthTexture)m=T(o.format===O,o.type),v&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,f,null));else if(o.isDataTexture){if(g.length>0){_&&v&&n.texStorage2D(e.TEXTURE_2D,C,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?b&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,f,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,f,h.data);o.generateMipmaps=!1}else _?(v&&n.texStorage2D(e.TEXTURE_2D,C,m,t.width,t.height),b&&he(o,t,r,f)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,f,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&v&&n.texStorage3D(e.TEXTURE_2D_ARRAY,C,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(b){if(o.layerUpdates.size>0){let t=We(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}o.clearLayerUpdates()}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?b&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,f,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,f,h.data)}else{_&&v&&n.texStorage2D(e.TEXTURE_2D,C,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?b&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,f,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,f,h.data):r===null?W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?b&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(v&&n.texStorage3D(e.TEXTURE_2D_ARRAY,C,m,t.width,t.height,t.depth),b){if(o.layerUpdates.size>0){let i=We(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,f,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,f,t.data)}else if(o.isData3DTexture)_?(v&&n.texStorage3D(e.TEXTURE_3D,C,m,t.width,t.height,t.depth),b&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,f,t.data);else if(o.isFramebufferTexture){if(v){if(_)n.texStorage2D(e.TEXTURE_2D,C,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<C;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,f,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),p.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of p)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}let r=e.RGBA,i=e.RGBA,a=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,r,i,a,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&v){let t=Ae(g[0]);n.texStorage2D(e.TEXTURE_2D,C,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?b&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,f,h):n.texImage2D(e.TEXTURE_2D,t,m,r,f,h);o.generateMipmaps=!1}else if(_){if(v){let r=Ae(t);n.texStorage2D(e.TEXTURE_2D,C,m,r.width,r.height)}b&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,f,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,f,t);x(o)&&S(c),d.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function _e(t,o,s){if(o.image.length!==6)return;let c=pe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Y.getPrimaries(Y.workingColorSpace),r=o.colorSpace===``?null:Y.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=y(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=B(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),v=w(o.internalFormat,g,_,o.normalized,o.colorSpace),b=o.isVideoTexture!==!0,C=u.__version===void 0||c===!0,T=l.dataReady,D=E(o,h);fe(e.TEXTURE_CUBE_MAP,o);let O;if(f){b&&C&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,v,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?b?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):b?T&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,b&&C){O.length>0&&D++;let t=Ae(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,v,t.width,t.height)}for(let t=0;t<6;t++)if(p){b?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;b?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{b?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,m[t]);for(let r=0;r<O.length;r++){let i=O[r];b?T&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}x(o)&&S(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ve(t,i,o,s,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=w(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),z(i)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,s,l,h.__webglTexture,0,De(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,s,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ye(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=T(n.stencilBuffer,a),s=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;z(n)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,De(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,De(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,s,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],s=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=w(o.internalFormat,s,l,o.normalized,o.colorSpace);z(n)?c.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,De(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,De(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function be(t,i,o){let s=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),s){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,D)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),fe(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else oe(i.depthTexture,0);let u=l.__webglTexture,d=De(i),f=s?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)z(i)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)z(i)?c.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`Unknown depthTexture format`)}function xe(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)be(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?be(i.__webglFramebuffer[0],t,0):be(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ye(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ye(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Se(t,n,i){let a=r.get(t);n!==void 0&&ve(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&xe(t)}function Ce(t){let i=t.texture,o=r.get(t),c=r.get(i);t.addEventListener(`dispose`,k);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,s.memory.textures++),u){o.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){o.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)o.__webglFramebuffer[t][n]=e.createFramebuffer()}else o.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){o.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)o.__webglFramebuffer[t]=e.createFramebuffer()}else o.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),s.memory.textures++)}if(t.samples>0&&z(t)===!1){o.__webglMultisampledFramebuffer=e.createFramebuffer(),o.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,o.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];o.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,o.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),s=a.convert(r.type),c=w(r.internalFormat,i,s,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=De(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,o.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(o.__webglDepthRenderbuffer=e.createRenderbuffer(),ye(o.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),fe(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ve(o.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ve(o.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);x(i)&&S(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],s=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,s.__webglTexture),fe(c,a),ve(o.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),x(a)&&S(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),fe(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ve(o.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ve(o.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);x(i)&&S(r),n.unbindTexture()}t.depthBuffer&&xe(t)}function R(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(x(a)){let t=C(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),S(t),n.unbindTexture()}}}let we=[],Te=[];function Ee(t){if(t.samples>0){if(z(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,c=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),l===!0&&(we.length=0,Te.length=0,we.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.resolveDepthBuffer===!1&&(we.push(c),Te.push(c),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Te)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,we))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.resolveDepthBuffer===!1&&l){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function De(e){return Math.min(i.maxSamples,e.samples)}function z(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function Oe(e){let t=s.render.frame;d.get(e)!==t&&(d.set(e,t),e.update())}function B(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Y.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&W(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):K(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ae(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(u.width=e.naturalWidth||e.width,u.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(u.width=e.displayWidth,u.height=e.displayHeight):(u.width=e.width,u.height=e.height),u}this.allocateTextureUnit=N,this.resetTextureUnits=re,this.getTextureUnits=M,this.setTextureUnits=ie,this.setTexture2D=oe,this.setTexture2DArray=P,this.setTexture3D=ce,this.setTextureCube=F,this.rebindTextures=Se,this.setupRenderTarget=Ce,this.updateRenderTargetMipmap=R,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=xe,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=z,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function oi(e,t){function n(n,r=``){let i,a=Y.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var si=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ci=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,li=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new r(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new B({vertexShader:si,fragmentShader:ci,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new y(new Ge(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},ui=class extends $e{constructor(e,t){super();let n=this,i=null,a=1,o=null,s=`local-floor`,c=1,l=null,u=null,d=null,f=null,p=null,m=null,h=typeof XRWebGLBinding<`u`,g=new li,y={},b=t.getContextAttributes(),x=null,S=null,C=[],w=[],E=new _,D=null,k=new Je;k.viewport=new de;let A=new Je;A.viewport=new de;let ee=[k,A],j=new Ue,re=null,M=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new L,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new L,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new L,C[e]=t),t.getHandSpace()};function N(e){let t=w.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,l||o),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ae(){i.removeEventListener(`select`,N),i.removeEventListener(`selectstart`,N),i.removeEventListener(`selectend`,N),i.removeEventListener(`squeeze`,N),i.removeEventListener(`squeezestart`,N),i.removeEventListener(`squeezeend`,N),i.removeEventListener(`end`,ae),i.removeEventListener(`inputsourceschange`,oe);for(let e=0;e<C.length;e++){let t=w[e];t!==null&&(w[e]=null,C[e].disconnect(t))}re=null,M=null,g.reset();for(let e in y)delete y[e];e.setRenderTarget(x),p=null,f=null,d=null,i=null,S=null,me.stop(),n.isPresenting=!1,e.setPixelRatio(D),e.setSize(E.width,E.height,!1),n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){a=e,n.isPresenting===!0&&W(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){s=e,n.isPresenting===!0&&W(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(e){l=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&h&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(r){if(i=r,i!==null){if(x=e.getRenderTarget(),i.addEventListener(`select`,N),i.addEventListener(`selectstart`,N),i.addEventListener(`selectend`,N),i.addEventListener(`squeeze`,N),i.addEventListener(`squeezestart`,N),i.addEventListener(`squeezeend`,N),i.addEventListener(`end`,ae),i.addEventListener(`inputsourceschange`,oe),b.xrCompatible!==!0&&await t.makeXRCompatible(),D=e.getPixelRatio(),e.getSize(E),h&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,r=null,o=null;b.depth&&(o=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=b.stencil?O:T,r=b.stencil?v:ie);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:a};d=this.getBinding(),f=d.createProjectionLayer(s),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new Ve(f.textureWidth,f.textureHeight,{format:ye,type:ne,depthTexture:new te(f.textureWidth,f.textureHeight,r,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:a};p=new XRWebGLLayer(i,t,n),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new Ve(p.framebufferWidth,p.framebufferHeight,{format:ye,type:ne,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(s),me.setContext(i),me.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function oe(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=w.indexOf(n);r>=0&&(w[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=w.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=w.length){w.push(n),r=e;break}else if(w[e]===null){w[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let P=new F,se=new F;function ce(e,t,n){P.setFromMatrixPosition(t.matrixWorld),se.setFromMatrixPosition(n.matrixWorld);let r=P.distanceTo(se),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(i===null)return;let t=e.near,n=e.far;g.texture!==null&&(g.depthNear>0&&(t=g.depthNear),g.depthFar>0&&(n=g.depthFar)),j.near=A.near=k.near=t,j.far=A.far=k.far=n,(re!==j.near||M!==j.far)&&(i.updateRenderState({depthNear:j.near,depthFar:j.far}),re=j.near,M=j.far),j.layers.mask=e.layers.mask|6,k.layers.mask=j.layers.mask&-5,A.layers.mask=j.layers.mask&-3;let r=e.parent,a=j.cameras;le(j,r);for(let e=0;e<a.length;e++)le(a[e],r);a.length===2?ce(j,k,A):j.projectionMatrix.copy(k.projectionMatrix),ue(e,j,r)};function ue(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=ze*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return j},this.getFoveation=function(){if(f!==null||p!==null)return c},this.setFoveation=function(e){c=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(j)},this.getCameraTexture=function(e){return y[e]};let fe=null;function pe(t,a){if(u=a.getViewerPose(l||o),m=a,u!==null){let t=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let a=!1;t.length!==j.cameras.length&&(j.cameras.length=0,a=!0);for(let n=0;n<t.length;n++){let r=t[n],i=null;if(p!==null)i=p.getViewport(r);else{let t=d.getViewSubImage(f,r);i=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=ee[n];o===void 0&&(o=new Je,o.layers.enable(n),o.viewport=new de,ee[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(i.x,i.y,i.width,i.height),n===0&&(j.matrix.copy(o.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale)),a===!0&&j.cameras.push(o)}let o=i.enabledFeatures;if(o&&o.includes(`depth-sensing`)&&i.depthUsage==`gpu-optimized`&&h){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&g.init(e,i.renderState)}if(o&&o.includes(`camera-access`)&&h){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=y[n];e||(e=new r,y[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=w[e],n=C[e];t!==null&&n!==void 0&&n.update(t,a,l||o)}fe&&fe(t,a),a.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:a}),m=null}let me=new nt;me.setAnimationLoop(pe),this.setAnimationLoop=function(e){fe=e},this.dispose=function(){}}},di=new m,fi=new j;fi.set(-1,0,0,0,1,0,0,0,1);function pi(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Ae(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(di.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(fi),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function mi(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(m(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return K(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let t=0,n=r.length;t<n;t++){let n=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,i=n.length;r<i;r++){let i=n[r];if(p(i,t,r,a)===!0){let t=i.__offset,n=Array.isArray(i.value)?i.value:[i.value],r=0;for(let a=0;a<n.length;a++){let o=n[a],s=h(o);typeof o==`number`||typeof o==`boolean`?(i.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,i.__data)):o.isMatrix3?(i.__data[0]=o.elements[0],i.__data[1]=o.elements[1],i.__data[2]=o.elements[2],i.__data[3]=0,i.__data[4]=o.elements[3],i.__data[5]=o.elements[4],i.__data[6]=o.elements[5],i.__data[7]=0,i.__data[8]=o.elements[6],i.__data[9]=o.elements[7],i.__data[10]=o.elements[8],i.__data[11]=0):ArrayBuffer.isView(o)?i.__data.set(new o.constructor(o.buffer,o.byteOffset,i.__data.length)):(o.toArray(i.__data,r),r+=s.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,i.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=h(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?W(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):W(`WebGLRenderer: Unsupported uniform value type.`,e),t}function g(t){let n=t.target;n.removeEventListener(`dispose`,g);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:_}}var hi=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),gi=null;function _i(){return gi===null&&(gi=new A(hi,16,16,he,fe),gi.name=`DFG_LUT`,gi.minFilter=o,gi.magFilter=o,gi.wrapS=ke,gi.wrapT=ke,gi.generateMipmaps=!1,gi.needsUpdate=!0),gi}var vi=class{constructor(e={}){let{canvas:t=Te(),context:n=null,depth:r=!0,stencil:a=!1,alpha:o=!1,antialias:s=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u=`default`,failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:p=ne}=e;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);h=n.getContextAttributes().alpha}else h=o;let g=p,_=new Set([Ze,pe,Pe]),y=new Set([ne,ie,le,v,et,i]),b=new Uint32Array(4),C=new Int32Array(4),w=new F,T=null,E=null,D=[],O=[],k=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,ee=!1,te=null;this._outputColorSpace=De;let j=0,re=0,M=null,N=-1,ae=null,oe=new de,P=new de,ce=null,ue=new z(0),me=0,I=t.width,he=t.height,L=1,ge=null,_e=null,ve=new de(0,0,I,he),ye=new de(0,0,I,he),be=!1,xe=new x,Se=!1,Ce=!1,R=new m,Ee=new F,Oe=new de,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},B=!1;function Ae(){return M===null?L:1}let V=n;function je(e,n){return t.getContext(e,n)}try{let e={alpha:!0,depth:r,stencil:a,antialias:s,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r184`),t.addEventListener(`webglcontextlost`,Z,!1),t.addEventListener(`webglcontextrestored`,it,!1),t.addEventListener(`webglcontextcreationerror`,at,!1),V===null){let t=`webgl2`;if(V=je(t,e),V===null)throw je(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}}catch(e){throw K(`WebGLRenderer: `+e.message),e}let Me,H,U,Ne,G,q,Ie,Le,Re,ze,Be,He,Ue,We,Ge,J,Ke,qe,Je,Ye,Xe,Qe,$e;function tt(){Me=new Ft(V),Me.init(),Xe=new oi(V,Me),H=new dt(V,Me,e,Xe),U=new ii(V,Me),H.reversedDepthBuffer&&f&&U.buffers.depth.setReversed(!0),Ne=new Rt(V),G=new Rr,q=new ai(V,Me,U,G,H,Xe,Ne),Ie=new Pt(A),Le=new rt(V),Qe=new lt(V,Le),Re=new It(V,Le,Ne,Qe),ze=new Bt(V,Re,Le,Qe,Ne),qe=new zt(V,H,q),Ge=new ft(G),Be=new Lr(A,Ie,Me,H,Qe,Ge),He=new pi(A,G),Ue=new Hr,We=new Yr(Me),Ke=new ct(A,Ie,U,ze,h,c),J=new ri(A,ze,H),$e=new mi(V,Ne,H,U),Je=new ut(V,Me,Ne),Ye=new Lt(V,Me,Ne),Ne.programs=Be.programs,A.capabilities=H,A.extensions=Me,A.properties=G,A.renderLists=Ue,A.shadowMap=J,A.state=U,A.info=Ne}tt(),g!==1009&&(k=new Ht(g,t.width,t.height,r,a));let X=new ui(A,V);this.xr=X,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){let e=Me.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Me.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(e){e!==void 0&&(L=e,this.setSize(I,he,!1))},this.getSize=function(e){return e.set(I,he)},this.setSize=function(e,n,r=!0){if(X.isPresenting){W(`WebGLRenderer: Can't change size while VR device is presenting.`);return}I=e,he=n,t.width=Math.floor(e*L),t.height=Math.floor(n*L),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),k!==null&&k.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(I*L,he*L).floor()},this.setDrawingBufferSize=function(e,n,r){I=e,he=n,L=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(g===1009){K(`THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){W(`THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}k.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(oe)},this.getViewport=function(e){return e.copy(ve)},this.setViewport=function(e,t,n,r){e.isVector4?ve.set(e.x,e.y,e.z,e.w):ve.set(e,t,n,r),U.viewport(oe.copy(ve).multiplyScalar(L).round())},this.getScissor=function(e){return e.copy(ye)},this.setScissor=function(e,t,n,r){e.isVector4?ye.set(e.x,e.y,e.z,e.w):ye.set(e,t,n,r),U.scissor(P.copy(ye).multiplyScalar(L).round())},this.getScissorTest=function(){return be},this.setScissorTest=function(e){U.setScissorTest(be=e)},this.setOpaqueSort=function(e){ge=e},this.setTransparentSort=function(e){_e=e},this.getClearColor=function(e){return e.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor(...arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(M!==null){let t=M.texture.format;e=_.has(t)}if(e){let e=M.texture.type,t=y.has(e),n=Ke.getClearColor(),r=Ke.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(b[0]=i,b[1]=a,b[2]=o,b[3]=r,V.clearBufferuiv(V.COLOR,0,b)):(C[0]=i,C[1]=a,C[2]=o,C[3]=r,V.clearBufferiv(V.COLOR,0,C))}else r|=V.COLOR_BUFFER_BIT}t&&(r|=V.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&V.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),te=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Z,!1),t.removeEventListener(`webglcontextrestored`,it,!1),t.removeEventListener(`webglcontextcreationerror`,at,!1),Ke.dispose(),Ue.dispose(),We.dispose(),G.dispose(),Ie.dispose(),ze.dispose(),Qe.dispose(),$e.dispose(),Be.dispose(),X.dispose(),X.removeEventListener(`sessionstart`,_t),X.removeEventListener(`sessionend`,vt),yt.stop()};function Z(e){e.preventDefault(),Fe(`WebGLRenderer: Context Lost.`),ee=!0}function it(){Fe(`WebGLRenderer: Context Restored.`),ee=!1;let e=Ne.autoReset,t=J.enabled,n=J.autoUpdate,r=J.needsUpdate,i=J.type;tt(),Ne.autoReset=e,J.enabled=t,J.autoUpdate=n,J.needsUpdate=r,J.type=i}function at(e){K(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ot(e){let t=e.target;t.removeEventListener(`dispose`,ot),st(t)}function st(e){pt(e),G.remove(e)}function pt(e){let t=G.get(e).programs;t!==void 0&&(t.forEach(function(e){Be.releaseProgram(e)}),e.isShaderMaterial&&Be.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ke);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=kt(e,t,n,r,i);U.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Re.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Qe.setup(i,r,s,n,c);let h,g=Je;if(c!==null&&(h=Le.get(c),g=Ye,g.setIndex(h)),i.isMesh)r.wireframe===!0?(U.setLineWidth(r.wireframeLinewidth*Ae()),g.setMode(V.LINES)):g.setMode(V.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),U.setLineWidth(e*Ae()),i.isLineSegments?g.setMode(V.LINES):i.isLineLoop?g.setMode(V.LINE_LOOP):g.setMode(V.LINE_STRIP)}else i.isPoints?g.setMode(V.POINTS):i.isSprite&&g.setMode(V.TRIANGLES);if(i.isBatchedMesh){if(Me.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Le.get(c).bytesPerElement:1,o=G.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(V,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function mt(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Tt(e,t,n),e.side=0,e.needsUpdate=!0,Tt(e,t,n),e.side=2):Tt(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),E=We.get(n),E.init(t),O.push(E),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(E.pushLight(e),e.castShadow&&E.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(E.pushLight(e),e.castShadow&&E.pushShadow(e))}),E.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];mt(a,n,e),r.add(a)}else mt(t,n,e),r.add(t)}}),E=O.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){G.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Me.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ht=null;function gt(e){ht&&ht(e)}function _t(){yt.stop()}function vt(){yt.start()}let yt=new nt;yt.setAnimationLoop(gt),typeof self<`u`&&yt.setContext(self),this.setAnimationLoop=function(e){ht=e,X.setAnimationLoop(e),e===null?yt.stop():yt.start()},X.addEventListener(`sessionstart`,_t),X.addEventListener(`sessionend`,vt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){K(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ee===!0)return;te!==null&&te.renderStart(e,t);let n=X.enabled===!0&&X.isPresenting===!0,r=k!==null&&(M===null||n)&&k.begin(A,M);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(k===null||k.isCompositing()===!1)&&(X.cameraAutoUpdate===!0&&X.updateCamera(t),t=X.getCamera()),e.isScene===!0&&e.onBeforeRender(A,e,t,M),E=We.get(e,O.length),E.init(t),E.state.textureUnits=q.getTextureUnits(),O.push(E),R.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),xe.setFromProjectionMatrix(R,S,t.reversedDepth),Ce=this.localClippingEnabled,Se=Ge.init(this.clippingPlanes,Ce),T=Ue.get(e,D.length),T.init(),D.push(T),X.enabled===!0&&X.isPresenting===!0){let e=A.xr.getDepthSensingMesh();e!==null&&bt(e,t,-1/0,A.sortObjects)}bt(e,t,0,A.sortObjects),T.finish(),A.sortObjects===!0&&T.sort(ge,_e),B=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,B&&Ke.addToRenderList(T,e),this.info.render.frame++,Se===!0&&Ge.beginShadows();let i=E.state.shadowsArray;if(J.render(i,e,t),Se===!0&&Ge.endShadows(),this.info.autoReset===!0&&this.info.reset(),(r&&k.hasRenderPass())===!1){let n=T.opaque,r=T.transmissive;if(E.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];St(n,r,e,a)}B&&Ke.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];xt(T,e,n,n.viewport)}}else r.length>0&&St(n,r,e,t),B&&Ke.render(e),xt(T,e,t)}M!==null&&re===0&&(q.updateMultisampleRenderTarget(M),q.updateRenderTargetMipmap(M)),r&&k.end(A),e.isScene===!0&&e.onAfterRender(A,e,t),Qe.resetDefaultState(),N=-1,ae=null,O.pop(),O.length>0?(E=O[O.length-1],q.setTextureUnits(E.state.textureUnits),Se===!0&&Ge.setGlobalState(A.clippingPlanes,E.state.camera)):E=null,D.pop(),T=D.length>0?D[D.length-1]:null,te!==null&&te.renderEnd()};function bt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)E.pushLightProbeGrid(e);else if(e.isLight)E.pushLight(e),e.castShadow&&E.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||xe.intersectsSprite(e)){r&&Oe.setFromMatrixPosition(e.matrixWorld).applyMatrix4(R);let t=ze.update(e),i=e.material;i.visible&&T.push(e,t,i,n,Oe.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||xe.intersectsObject(e))){let t=ze.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),Oe.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Oe.copy(e.boundingSphere.center)),Oe.applyMatrix4(e.matrixWorld).applyMatrix4(R)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&T.push(e,t,s,n,Oe.z,o)}}else i.visible&&T.push(e,t,i,n,Oe.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)bt(i[e],t,n,r)}function xt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;E.setupLightsView(n),Se===!0&&Ge.setGlobalState(A.clippingPlanes,n),r&&U.viewport(oe.copy(r)),i.length>0&&Ct(i,t,n),a.length>0&&Ct(a,t,n),o.length>0&&Ct(o,t,n),U.buffers.depth.setTest(!0),U.buffers.depth.setMask(!0),U.buffers.color.setMask(!0),U.setPolygonOffset(!1)}function St(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[r.id]===void 0){let e=Me.has(`EXT_color_buffer_half_float`)||Me.has(`EXT_color_buffer_float`);E.state.transmissionRenderTarget[r.id]=new Ve(1,1,{generateMipmaps:!0,type:e?fe:ne,minFilter:se,samples:Math.max(4,H.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Y.workingColorSpace})}let i=E.state.transmissionRenderTarget[r.id],o=r.viewport||oe;i.setSize(o.z*A.transmissionResolutionScale,o.w*A.transmissionResolutionScale);let s=A.getRenderTarget(),c=A.getActiveCubeFace(),l=A.getActiveMipmapLevel();A.setRenderTarget(i),A.getClearColor(ue),me=A.getClearAlpha(),me<1&&A.setClearColor(16777215,.5),A.clear(),B&&Ke.render(n);let u=A.toneMapping;A.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),E.setupLightsView(r),Se===!0&&Ge.setGlobalState(A.clippingPlanes,r),Ct(e,n,r),q.updateMultisampleRenderTarget(i),q.updateRenderTargetMipmap(i),Me.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,wt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(q.updateMultisampleRenderTarget(i),q.updateRenderTargetMipmap(i))}A.setRenderTarget(s,c,l),A.setClearColor(ue,me),d!==void 0&&(r.viewport=d),A.toneMapping=u}function Ct(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&wt(o,t,n,s,l,c)}}function wt(e,t,n,r,i,a){e.onBeforeRender(A,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(A,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,A.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,A.renderBufferDirect(n,t,r,i,e,a),i.side=2):A.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(A,t,n,r,i,a)}function Tt(e,t,n){t.isScene!==!0&&(t=ke);let r=G.get(e),i=E.state.lights,a=E.state.shadowsArray,o=i.state.version,s=Be.getParameters(e,i.state,a,t,n,E.state.lightProbeGridArray),c=Be.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ie.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ot),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Dt(e,s),d}else s.uniforms=Be.getUniforms(e),te!==null&&e.isNodeMaterial&&te.build(e,n,s),e.onBeforeCompile(s,A),d=Be.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ge.uniform),Dt(e,s),r.needsLights=jt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=E.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Et(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Xn.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Dt(e,t){let n=G.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Ot(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];w.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(w))return n}return null}function kt(e,t,n,r,i){t.isScene!==!0&&(t=ke),q.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=M===null?A.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:Y.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ie.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(h=A.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=G.get(r),y=E.state.lights;if(Se===!0&&(Ce===!0||e!==ae)){let t=e===ae&&r.id===N;Ge.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ge.numPlanes||v.numIntersection!==Ge.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=E.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Tt(r,t,i),te&&r.isNodeMaterial&&te.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),D=v.uniforms;if(U.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==N&&(N=r.id,C=!0),v.needsLights){let e=Ot(E.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||ae!==e){U.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(V,`projectionMatrix`,e.projectionMatrix),T.setValue(V,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(V,Ee.setFromMatrixPosition(e.matrixWorld)),H.logarithmicDepthBuffer&&T.setValue(V,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(V,`isOrthographic`,e.isOrthographicCamera===!0),ae!==e&&(ae=e,C=!0,w=!0)}if(v.needsLights&&(y.state.directionalShadowMap.length>0&&T.setValue(V,`directionalShadowMap`,y.state.directionalShadowMap,q),y.state.spotShadowMap.length>0&&T.setValue(V,`spotShadowMap`,y.state.spotShadowMap,q),y.state.pointShadowMap.length>0&&T.setValue(V,`pointShadowMap`,y.state.pointShadowMap,q)),i.isSkinnedMesh){T.setOptional(V,i,`bindMatrix`),T.setOptional(V,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(V,`boneTexture`,e.boneTexture,q))}i.isBatchedMesh&&(T.setOptional(V,i,`batchingTexture`),T.setValue(V,`batchingTexture`,i._matricesTexture,q),T.setOptional(V,i,`batchingIdTexture`),T.setValue(V,`batchingIdTexture`,i._indirectTexture,q),T.setOptional(V,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(V,`batchingColorTexture`,i._colorsTexture,q));let O=n.morphAttributes;if((O.position!==void 0||O.normal!==void 0||O.color!==void 0)&&qe.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(V,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(D.envMapIntensity.value=t.environmentIntensity),D.dfgLUT!==void 0&&(D.dfgLUT.value=_i()),C){if(T.setValue(V,`toneMappingExposure`,A.toneMappingExposure),v.needsLights&&At(D,w),a&&r.fog===!0&&He.refreshFogUniforms(D,a),He.refreshMaterialUniforms(D,r,L,he,E.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;D.probesSH.value=e.texture,D.probesMin.value.copy(e.boundingBox.min),D.probesMax.value.copy(e.boundingBox.max),D.probesResolution.value.copy(e.resolution)}Xn.upload(V,Et(v),D,q)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Xn.upload(V,Et(v),D,q),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(V,`center`,i.center),T.setValue(V,`modelViewMatrix`,i.modelViewMatrix),T.setValue(V,`normalMatrix`,i.normalMatrix),T.setValue(V,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];$e.update(n,x),$e.bind(n,x)}}return x}function At(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function jt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return re},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(e,t,n){let r=G.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),G.get(e.texture).__webglTexture=t,G.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=G.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0};let Mt=V.createFramebuffer();this.setRenderTarget=function(e,t=0,n=0){M=e,j=t,re=n;let r=null,i=!1,a=!1;if(e){let o=G.get(e);if(o.__useDefaultFramebuffer!==void 0){U.bindFramebuffer(V.FRAMEBUFFER,o.__webglFramebuffer),oe.copy(e.viewport),P.copy(e.scissor),ce=e.scissorTest,U.viewport(oe),U.scissor(P),U.setScissorTest(ce),N=-1;return}if(o.__webglFramebuffer===void 0)q.setupRenderTarget(e);else if(o.__hasExternalTextures)q.rebindTextures(e,G.get(e.texture).__webglTexture,G.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&G.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`);q.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=G.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&q.useMultisampledRTT(e)===!1?G.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,oe.copy(e.viewport),P.copy(e.scissor),ce=e.scissorTest}else oe.copy(ve).multiplyScalar(L).floor(),P.copy(ye).multiplyScalar(L).floor(),ce=be;if(n!==0&&(r=Mt),U.bindFramebuffer(V.FRAMEBUFFER,r)&&U.drawBuffers(e,r),U.viewport(oe),U.scissor(P),U.setScissorTest(ce),i){let r=G.get(e.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=G.get(e.textures[t]);V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=G.get(e.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,t.__webglTexture,n)}N=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){K(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=G.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){U.bindFramebuffer(V.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+s),!H.textureFormatReadable(c)){K(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!H.textureTypeReadable(l)){K(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&V.readPixels(t,n,r,i,Xe.convert(c),Xe.convert(l),a)}finally{let e=M===null?null:G.get(M).__webglFramebuffer;U.bindFramebuffer(V.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=G.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){U.bindFramebuffer(V.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+s),!H.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!H.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,d),V.bufferData(V.PIXEL_PACK_BUFFER,a.byteLength,V.STREAM_READ),V.readPixels(t,n,r,i,Xe.convert(l),Xe.convert(u),0);let f=M===null?null:G.get(M).__webglFramebuffer;U.bindFramebuffer(V.FRAMEBUFFER,f);let p=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await we(V,p,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,d),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,a),V.deleteBuffer(d),V.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;q.setTexture2D(e,0),V.copyTexSubImage2D(V.TEXTURE_2D,n,0,0,o,s,i,a),U.unbindTexture()};let Nt=V.createFramebuffer(),Vt=V.createFramebuffer();this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Xe.convert(t.format),_=Xe.convert(t.type),v;t.isData3DTexture?(q.setTexture3D(t,0),v=V.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(q.setTexture2DArray(t,0),v=V.TEXTURE_2D_ARRAY):(q.setTexture2D(t,0),v=V.TEXTURE_2D),U.activeTexture(V.TEXTURE0),U.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,t.flipY),U.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),U.pixelStorei(V.UNPACK_ALIGNMENT,t.unpackAlignment);let y=U.getParameter(V.UNPACK_ROW_LENGTH),b=U.getParameter(V.UNPACK_IMAGE_HEIGHT),x=U.getParameter(V.UNPACK_SKIP_PIXELS),S=U.getParameter(V.UNPACK_SKIP_ROWS),C=U.getParameter(V.UNPACK_SKIP_IMAGES);U.pixelStorei(V.UNPACK_ROW_LENGTH,h.width),U.pixelStorei(V.UNPACK_IMAGE_HEIGHT,h.height),U.pixelStorei(V.UNPACK_SKIP_PIXELS,l),U.pixelStorei(V.UNPACK_SKIP_ROWS,u),U.pixelStorei(V.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=G.get(e),r=G.get(t),h=G.get(n.__renderTarget),g=G.get(r.__renderTarget);U.bindFramebuffer(V.READ_FRAMEBUFFER,h.__webglFramebuffer),U.bindFramebuffer(V.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,G.get(e).__webglTexture,i,d+n),V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,G.get(t).__webglTexture,a,m+n)),V.blitFramebuffer(l,u,o,s,f,p,o,s,V.DEPTH_BUFFER_BIT,V.NEAREST);U.bindFramebuffer(V.READ_FRAMEBUFFER,null),U.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||G.has(e)){let n=G.get(e),r=G.get(t);U.bindFramebuffer(V.READ_FRAMEBUFFER,Nt),U.bindFramebuffer(V.DRAW_FRAMEBUFFER,Vt);for(let e=0;e<c;e++)w?V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):V.framebufferTexture2D(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,n.__webglTexture,i),T?V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):V.framebufferTexture2D(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,r.__webglTexture,a),i===0?T?V.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):V.copyTexSubImage2D(v,a,f,p,l,u,o,s):V.blitFramebuffer(l,u,o,s,f,p,o,s,V.COLOR_BUFFER_BIT,V.NEAREST);U.bindFramebuffer(V.READ_FRAMEBUFFER,null),U.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?V.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?V.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):V.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):V.texSubImage2D(V.TEXTURE_2D,a,f,p,o,s,g,_,h);U.pixelStorei(V.UNPACK_ROW_LENGTH,y),U.pixelStorei(V.UNPACK_IMAGE_HEIGHT,b),U.pixelStorei(V.UNPACK_SKIP_PIXELS,x),U.pixelStorei(V.UNPACK_SKIP_ROWS,S),U.pixelStorei(V.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&V.generateMipmap(v),U.unbindTexture()},this.initRenderTarget=function(e){G.get(e).__webglFramebuffer===void 0&&q.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?q.setTextureCube(e,0):e.isData3DTexture?q.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?q.setTexture2DArray(e,0):q.setTexture2D(e,0),U.unbindTexture()},this.resetState=function(){j=0,re=0,M=null,U.reset(),Qe.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return S}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Y._getDrawingBufferColorSpace(e),t.unpackColorSpace=Y._getUnpackColorSpace()}},yi=class{canvas;stick;knob;dashButton;ultButton;camera;keys=new Set;stickVector=new _;aimVector=new _(0,-1);pointerState={active:!1,id:null,centerX:0,centerY:0,radius:1};dashQueued=!1;ultQueued=!1;pauseQueued=!1;restartQueued=!1;upgradeQueued=-1;weaponQueued=-1;fireHeld=!1;pointerAimActive=!1;raycaster=new e;groundPlane=new q(new F(0,1,0),0);ndc=new _;hitPoint=new F;onKeyDown=e=>{this.keys.add(e.code),(e.code===`Space`||e.code===`ShiftLeft`||e.code===`ShiftRight`)&&(this.dashQueued=!0),e.code===`KeyQ`&&(this.ultQueued=!0),(e.code===`KeyP`||e.code===`Escape`)&&(this.pauseQueued=!0),e.code===`KeyR`&&(this.restartQueued=!0),(e.code===`Digit1`||e.code===`Numpad1`)&&(e.repeat||(this.upgradeQueued=0,this.weaponQueued=0)),(e.code===`Digit2`||e.code===`Numpad2`)&&(e.repeat||(this.upgradeQueued=1,this.weaponQueued=1)),(e.code===`Digit3`||e.code===`Numpad3`)&&(e.repeat||(this.upgradeQueued=2,this.weaponQueued=2))};onKeyUp=e=>{this.keys.delete(e.code)};onPointerDown=e=>{e.button===0&&(this.fireHeld=!0),this.updateAimFromPointer(e.clientX,e.clientY)};onPointerUp=e=>{e.button===0&&(this.fireHeld=!1)};onPointerMove=e=>{this.updateAimFromPointer(e.clientX,e.clientY)};onStickDown=e=>{e.preventDefault(),e.stopPropagation();let t=this.stick.getBoundingClientRect();this.pointerState.active=!0,this.pointerState.id=e.pointerId,this.pointerState.centerX=t.left+t.width/2,this.pointerState.centerY=t.top+t.height/2,this.pointerState.radius=t.width*.42;try{this.stick.setPointerCapture(e.pointerId)}catch{}this.updateStick(e.clientX,e.clientY)};onStickMove=e=>{this.pointerState.active&&e.pointerId===this.pointerState.id&&(e.preventDefault(),this.updateStick(e.clientX,e.clientY))};onStickUp=e=>{e.pointerId===this.pointerState.id&&(e.preventDefault(),this.pointerState.active=!1,this.pointerState.id=null,this.stickVector.set(0,0),this.updateKnob())};onDashDown=e=>{e.preventDefault(),e.stopPropagation(),this.dashQueued=!0};onUltDown=e=>{e.preventDefault(),e.stopPropagation(),this.ultQueued=!0};constructor(e,t,n,r,i,a){this.canvas=e,this.stick=t,this.knob=n,this.dashButton=r,this.ultButton=i,this.camera=a,window.addEventListener(`keydown`,this.onKeyDown),window.addEventListener(`keyup`,this.onKeyUp),e.addEventListener(`pointerdown`,this.onPointerDown),window.addEventListener(`pointerup`,this.onPointerUp),window.addEventListener(`pointercancel`,this.onPointerUp),e.addEventListener(`pointermove`,this.onPointerMove),this.stick.addEventListener(`pointerdown`,this.onStickDown),this.stick.addEventListener(`pointermove`,this.onStickMove),this.stick.addEventListener(`pointerup`,this.onStickUp),this.stick.addEventListener(`pointercancel`,this.onStickUp),this.dashButton.addEventListener(`pointerdown`,this.onDashDown),this.ultButton.addEventListener(`pointerdown`,this.onUltDown)}read(e){let t=e.move.set(0,0);(this.keys.has(`KeyA`)||this.keys.has(`ArrowLeft`))&&--t.x,(this.keys.has(`KeyD`)||this.keys.has(`ArrowRight`))&&(t.x+=1),(this.keys.has(`KeyW`)||this.keys.has(`ArrowUp`))&&--t.y,(this.keys.has(`KeyS`)||this.keys.has(`ArrowDown`))&&(t.y+=1),t.add(this.stickVector),t.lengthSq()>1&&t.normalize();let n=window.matchMedia(`(pointer: coarse)`).matches;return e.fireHeld=this.fireHeld||n&&this.stickVector.lengthSq()>.04,e.aim.copy(this.aimVector),e.dashPressed=this.dashQueued,e.ultPressed=this.ultQueued,e.pausePressed=this.pauseQueued,e.restartPressed=this.restartQueued,e.upgradeChoice=this.upgradeQueued,e.weaponChoice=this.weaponQueued,this.dashQueued=!1,this.ultQueued=!1,this.pauseQueued=!1,this.restartQueued=!1,this.upgradeQueued=-1,this.weaponQueued=-1,e}dispose(){window.removeEventListener(`keydown`,this.onKeyDown),window.removeEventListener(`keyup`,this.onKeyUp),this.canvas.removeEventListener(`pointerdown`,this.onPointerDown),window.removeEventListener(`pointerup`,this.onPointerUp),window.removeEventListener(`pointercancel`,this.onPointerUp),this.canvas.removeEventListener(`pointermove`,this.onPointerMove),this.stick.removeEventListener(`pointerdown`,this.onStickDown),this.stick.removeEventListener(`pointermove`,this.onStickMove),this.stick.removeEventListener(`pointerup`,this.onStickUp),this.stick.removeEventListener(`pointercancel`,this.onStickUp),this.dashButton.removeEventListener(`pointerdown`,this.onDashDown),this.ultButton.removeEventListener(`pointerdown`,this.onUltDown)}updateStick(e,t){let n=e-this.pointerState.centerX,r=t-this.pointerState.centerY;this.stickVector.set(n/this.pointerState.radius,r/this.pointerState.radius),this.stickVector.lengthSq()>1&&this.stickVector.normalize(),this.updateKnob()}updateKnob(){this.knob.style.transform=`translate(calc(-50% + ${this.stickVector.x*38}px), calc(-50% + ${this.stickVector.y*38}px))`}updateAimFromPointer(e,t){let n=this.canvas.getBoundingClientRect();this.ndc.set((e-n.left)/n.width*2-1,-((t-n.top)/n.height*2-1)),this.raycaster.setFromCamera(this.ndc,this.camera),this.raycaster.ray.intersectPlane(this.groundPlane,this.hitPoint)&&(this.pointerAimActive=!0)}computeAim(e,t){if(this.pointerAimActive&&(t.set(this.hitPoint.x-e.x,this.hitPoint.z-e.z),t.lengthSq()>4e-4)){t.normalize(),this.aimVector.copy(t);return}if(this.stickVector.lengthSq()>.08){t.copy(this.stickVector).normalize(),this.aimVector.copy(t);return}t.copy(this.aimVector)}},bi=class{update;render;frameId=0;lastTime=0;running=!1;accumulator=0;maxStep=.1;maxStepsPerFrame=4;constructor(e,t){this.update=e,this.render=t}start(){this.running||(this.running=!0,this.lastTime=performance.now(),this.frameId=requestAnimationFrame(this.tick))}stop(){this.running=!1,cancelAnimationFrame(this.frameId)}tick=e=>{if(!this.running)return;let t=(e-this.lastTime)/1e3;this.lastTime=e,t=Math.min(Math.max(t,0),.25),this.accumulator+=t;let n=0;for(;this.accumulator>=1/120&&n<this.maxStepsPerFrame;){let t=Math.min(this.accumulator,this.maxStep);this.accumulator-=t,this.update(t,e/1e3),n+=1}this.accumulator>this.maxStep*2&&(this.accumulator=0),this.render(),this.frameId=requestAnimationFrame(this.tick)}},xi=`modulepreload`,Si=function(e){return`/model-limit-game/`+e},Ci={},wi=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=Si(t,n),t=s(t),t in Ci)return;Ci[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:xi,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};function Ti(){return typeof navigator<`u`&&`gpu`in navigator&&!!navigator.gpu}function Ei(e){let t=new vi({canvas:e,antialias:!0,alpha:!1,powerPreference:`high-performance`});return t.outputColorSpace=De,t.toneMapping=4,t.toneMappingExposure=1.05,t.shadowMap.enabled=!0,t.shadowMap.type=1,t.info.autoReset=!1,t}async function Di(e){let t=Ti(),n=new URLSearchParams(window.location.search).get(`renderer`);if((n===`webgpu`||n===`webgpu-premium`)&&t)try{let{WebGPURenderer:n}=await wi(async()=>{let{WebGPURenderer:e}=await import(`./three.webgpu-CWtlW6YC.js`);return{WebGPURenderer:e}},__vite__mapDeps([0,1])),r=new n({canvas:e,antialias:!0,alpha:!1,powerPreference:`high-performance`});return r.toneMapping=4,r.toneMappingExposure=1.05,r.shadowMap.enabled=!0,r.info.autoReset=!1,{kind:`webgpu`,renderer:r,webgpuSupported:t,supportsWebGlPost:!1}}catch{}return{kind:`webgl2`,renderer:Ei(e),webgpuSupported:t,supportsWebGlPost:!0}}function Oi(e){return{kind:`webgl2`,renderer:Ei(e),webgpuSupported:Ti(),supportsWebGlPost:!0}}async function ki(e){if(e.kind!==`webgpu`)return;let t=e.renderer;typeof t.init==`function`&&await t.init()}function Ai(e,t,n=2){let r=e.renderer,i=r.domElement,a=Math.max(1,Math.floor(i.clientWidth)),o=Math.max(1,Math.floor(i.clientHeight)),s=Math.min(window.devicePixelRatio||1,n),c=Math.floor(a*s),l=Math.floor(o*s),u=i.width!==c||i.height!==l;return u&&(r.setPixelRatio(s),r.setSize(a,o,!1),t.aspect=a/o,t.updateProjectionMatrix()),u}function ji(e){let t=document.createElement(`canvas`);t.width=256,t.height=256;let n=t.getContext(`2d`);if(!n)throw Error(`cover panel texture`);n.fillStyle=`#0e3a48`,n.fillRect(0,0,256,256),n.strokeStyle=`rgba(0,0,0,0.45)`,n.lineWidth=3;for(let e=0;e<=256;e+=64)n.beginPath(),n.moveTo(e,0),n.lineTo(e,256),n.moveTo(0,e),n.lineTo(256,e),n.stroke();n.strokeStyle=`rgba(34,211,238,0.25)`,n.lineWidth=1;for(let e=0;e<=256;e+=64)n.beginPath(),n.moveTo(e+2,0),n.lineTo(e+2,256),n.stroke();for(let t=0;t<40;t+=1){let t=e()*256,r=e()*256;n.strokeStyle=`rgba(200,220,230,${.04+e()*.08})`,n.lineWidth=1,n.beginPath(),n.moveTo(t,r),n.lineTo(t+(e()-.5)*30,r+(e()-.5)*8),n.stroke()}n.fillStyle=`#3d4a5c`;for(let[e,t]of[[12,12],[244,12],[12,244],[244,244]])n.beginPath(),n.arc(e,t,5,0,Math.PI*2),n.fill();let r=new Re(t);return r.colorSpace=De,r}function Mi(){let e=document.createElement(`canvas`);e.width=128,e.height=128;let t=e.getContext(`2d`);if(!t)throw Error(`frame tex`);t.fillStyle=`#1c2433`,t.fillRect(0,0,128,128),t.fillStyle=`#243044`;for(let e=0;e<128;e+=16)t.fillRect(0,e,128,8);t.fillStyle=`rgba(0,0,0,0.35)`;for(let e=8;e<128;e+=16)t.fillRect(0,e,128,2);let n=new Re(e);return n.colorSpace=De,n.wrapS=n.wrapT=V,n}var Ni=class{size;mesh=new I;hp;alive=!0;radius;geometries=[];materials=[];textures=[];panelMat;constructor(e,t,n=90,r=Math.random){this.size=t,this.hp=n,this.radius=Math.max(t.x,t.z)*.48;let i=ji(r),a=Mi();a.repeat.set(2,1),this.textures.push(i,a);let o=new h({color:`#1c2433`,map:a,roughness:.62,metalness:.55,emissive:`#05080f`,emissiveIntensity:.08}),s=new h({color:`#4a5568`,roughness:.35,metalness:.75});this.panelMat=new h({color:`#ffffff`,map:i,roughness:.32,metalness:.45,emissive:`#0a6b80`,emissiveIntensity:.4});let c=new w({color:`#22d3ee`,transparent:!0,opacity:.5}),l=new h({color:`#f59e0b`,roughness:.48,metalness:.3,emissive:`#92400e`,emissiveIntensity:.3}),u=new h({color:`#5c4030`,roughness:.85,metalness:.15,transparent:!0,opacity:.55});this.materials.push(o,s,this.panelMat,c,l,u);let{x:d,y:f,z:p}=t,m=this.box(d,f*.9,p,o,0,f*.45,0);m.castShadow=!0,m.receiveShadow=!0;let g=this.box(d*.78,.05,p*.78,this.panelMat,0,f*.9,0);g.castShadow=!1;let _=.12;for(let e of[-1,1])for(let t of[-1,1])this.box(_,f,_,s,e*(d*.5-_*.5),f*.5,t*(p*.5-_*.5));let v=this.box(d*.35,f*.25,.03,u,(r()-.5)*d*.3,f*.35,p*.51);v.castShadow=!1;let y=this.box(d*.9,.03,.04,c,0,f*.92,p*.42),b=this.box(d*.9,.03,.04,c,0,f*.92,-p*.42);y.castShadow=b.castShadow=!1;let x=this.box(d*.55,.1,.04,l,0,f*.28,p*.52);x.castShadow=!1;let S=this.box(.04,.1,p*.35,l,d*.52,f*.28,0);S.castShadow=!1,this.mesh.position.copy(e)}box(e,t,n,r,i,a,o){let s=new R(e,t,n);this.geometries.push(s);let c=new y(s,r);return c.position.set(i,a,o),this.mesh.add(c),c}takeDamage(e){if(!this.alive)return!1;this.hp-=e;let t=D.clamp(this.hp/90,0,1);return this.panelMat.emissiveIntensity=.4+(1-t)*.9,this.panelMat.emissive.set(t>.5?`#0a6b80`:`#9f1239`),this.hp<=0&&(this.hp=0,this.alive=!1,this.mesh.visible=!1,!0)}resolveEntity(e,t){if(!this.alive)return;let n=e.x,r=e.z,i=this.mesh.position.x,a=this.mesh.position.z,o=this.size.x*.5+t,s=this.size.z*.5+t,c=n-i,l=r-a;Math.abs(c)<=o&&Math.abs(l)<=s&&(o-Math.abs(c)<s-Math.abs(l)?e.x=i+Math.sign(c||1)*o:e.z=a+Math.sign(l||1)*s)}blocksPoint(e,t=.15){if(!this.alive)return!1;let n=this.size.x*.5+t,r=this.size.z*.5+t;return Math.abs(e.x-this.mesh.position.x)<=n&&Math.abs(e.z-this.mesh.position.z)<=r&&e.y<this.size.y+.2}reset(e=90){this.hp=e,this.alive=!0,this.mesh.visible=!0,this.panelMat.emissiveIntensity=.4,this.panelMat.emissive.set(`#0a6b80`)}dispose(){for(let e of this.geometries)e.dispose();for(let e of this.materials)e.dispose();for(let e of this.textures)e.dispose()}},Pi={shield:`#3ec6ff`,coolant:`#ffb020`,heal:`#4ade80`,ult:`#a78bfa`},Fi=class{index;group=new I;radius=.55;active=!0;kind=`shield`;visual=new I;geometries=[];materials=[];coreMat;accentMat;ringMat;groundRing;beam;beamMat;magnet=0;pop=0;constructor(e){this.index=e,this.coreMat=new h({color:Pi.shield,emissive:Pi.shield,emissiveIntensity:.85,roughness:.28,metalness:.35}),this.accentMat=new h({color:`#e8eef7`,emissive:Pi.shield,emissiveIntensity:.25,roughness:.25,metalness:.6}),this.ringMat=new w({color:Pi.shield,transparent:!0,opacity:.35,side:2,depthWrite:!1}),this.materials.push(this.coreMat,this.accentMat,this.ringMat),this.beamMat=new w({color:Pi.shield,transparent:!0,opacity:.08,depthWrite:!1,side:2}),this.materials.push(this.beamMat);let t=new P(.06,.18,1.6,8,1,!0);this.geometries.push(t),this.beam=new y(t,this.beamMat),this.beam.position.y=.8,this.group.add(this.beam),this.buildVisual(`shield`),this.group.add(this.visual);let n=new Ke(.55,.62,32);this.geometries.push(n),this.groundRing=new y(n,this.ringMat),this.groundRing.rotation.x=-Math.PI/2,this.groundRing.position.y=.03,this.group.add(this.groundRing),this.group.visible=!1}clearVisual(){this.visual.clear()}buildVisual(e){this.clearVisual();let t=Pi[e];if(e===`shield`){let e=new P(.28,.28,.1,6);this.geometries.push(e);let t=new y(e,this.coreMat);t.rotation.x=Math.PI/2,t.castShadow=!0,this.visual.add(t);let n=new H(.3,.035,6,6);this.geometries.push(n);let r=new y(n,this.accentMat);this.visual.add(r)}else if(e===`coolant`){let e=new P(.14,.14,.4,8);this.geometries.push(e);let t=new y(e,this.coreMat);t.castShadow=!0,this.visual.add(t);let n=new P(.16,.16,.06,8);this.geometries.push(n);let r=new y(n,this.accentMat);r.position.y=.22;let i=new y(n,this.accentMat);i.position.y=-.22,this.visual.add(r,i)}else if(e===`heal`){let e=new R(.36,.1,.1),t=new R(.1,.36,.1);this.geometries.push(e,t);let n=new y(e,this.coreMat),r=new y(t,this.coreMat);n.castShadow=!0,this.visual.add(n,r)}else{let e=new n(.28,0);this.geometries.push(e);let t=new y(e,this.coreMat);t.castShadow=!0,this.visual.add(t);let r=new H(.34,.03,6,20);this.geometries.push(r);let i=new y(r,this.accentMat);i.rotation.x=Math.PI/2,this.visual.add(i)}this.coreMat.color.set(t),this.coreMat.emissive.set(t),this.accentMat.emissive.set(t),this.ringMat.color.set(t),this.beamMat&&this.beamMat.color.set(t)}spawn(e,t,n){this.kind=t,this.active=!0,this.magnet=0,this.pop=1,this.group.visible=!0,this.group.position.set(e.x,.55,e.z),this.buildVisual(t),this.group.rotation.y=n,this.visual.scale.setScalar(1.35)}update(e,t,n){if(!this.active)return!1;if(this.group.rotation.y+=e*2.2,this.visual.rotation.x=Math.sin(t*2+this.index)*.15,this.group.position.y=.55+Math.sin(t*3+this.index)*.1,this.pop>0&&(this.pop=Math.max(0,this.pop-e*3),this.visual.scale.setScalar(1+this.pop*.35)),n){let t=n.x-this.group.position.x,r=n.z-this.group.position.z,i=Math.hypot(t,r),a=2.8;if(i<a&&i>.05){this.magnet=Math.min(1,this.magnet+e*3);let n=(1-i/a)*6.5*this.magnet;this.group.position.x+=t/i*n*e,this.group.position.z+=r/i*n*e,this.ringMat.opacity=.35+this.magnet*.45,this.coreMat.emissiveIntensity=.85+this.magnet*.8,this.groundRing.scale.setScalar(1+this.magnet*.35),this.beamMat.opacity=.08+this.magnet*.35,this.beam.scale.set(1+this.magnet*.5,1,1+this.magnet*.5)}else this.magnet=Math.max(0,this.magnet-e*2),this.ringMat.opacity=.35,this.coreMat.emissiveIntensity=.85,this.groundRing.scale.setScalar(1),this.beamMat.opacity=.08,this.beam.scale.setScalar(1)}return!0}collect(){this.active=!1,this.group.visible=!1,this.magnet=0}reset(){this.active=!1,this.group.visible=!1,this.magnet=0,this.pop=0}stabilizeVisuals(){this.group.position.y=.55,this.visual.scale.setScalar(1)}dispose(){for(let e of this.geometries)e.dispose();for(let e of this.materials)e.dispose()}},Ii={maxHp:100,maxShield:50,maxHeat:100,moveSpeed:6.2,dashSpeed:16,dashDuration:.16,dashCooldown:1.1,fireInterval:.11,heatPerShot:4.2,heatCoolPerSec:28,overheatLockPerSec:22,projectileSpeed:28,projectileDamage:12,ultChargePerKill:8,ultDamage:55,ultRadius:7.5,invulnAfterHit:.65},Li=class{stats;group=new I;visual=new I;velocity=new F;aim=new _(0,-1);hp=Ii.maxHp;shield=Ii.maxShield;heat=0;overheated=!1;overheatEmp=!1;overheatPulse=!1;ultCharge=0;dashTimer=0;dashCooldown=0;fireCooldown=0;invulnTimer=0;alive=!0;dashSpeedMul=1;moveAccel=14;muzzle=new F;recoil=0;dashGhostTimer=0;ghosts=[];ghostMat;chassisMat;armorMat;accentMat;glowMat;visorMat;thrusterMat;geometries=[];ringGeo;ringMat;ring;thrusters=[];formTier=0;formGroups=[];formAccents=[];weaponId=`plasma`;cannonBody;cannonShroud;muzzleRing;formAccent=`#22d3ee`;constructor(e={...Ii}){this.stats=e,this.ghostMat=new w({color:`#22d3ee`,transparent:!0,opacity:.35,depthWrite:!1}),this.chassisMat=new h({color:`#1a2740`,roughness:.42,metalness:.55,emissive:`#061018`,emissiveIntensity:.15}),this.armorMat=new h({color:`#2dd4e8`,roughness:.28,metalness:.62,emissive:`#0b4a58`,emissiveIntensity:.35}),this.accentMat=new h({color:`#e8eef7`,roughness:.22,metalness:.7,emissive:`#22d3ee`,emissiveIntensity:.12}),this.glowMat=new h({color:`#7ae7ff`,emissive:`#22d3ee`,emissiveIntensity:1.4,roughness:.3,metalness:.2}),this.visorMat=new h({color:`#050a12`,roughness:.15,metalness:.85,emissive:`#67e8f9`,emissiveIntensity:1.1}),this.thrusterMat=new h({color:`#a5f3fc`,emissive:`#22d3ee`,emissiveIntensity:1.6,roughness:.25,metalness:.1});let t=this.box(.95,.32,1.15,this.chassisMat,0,.42,.05);t.castShadow=!0;let n=this.box(.7,.22,.55,this.armorMat,0,.48,-.72);n.rotation.x=.18,n.castShadow=!0;let r=this.box(.32,.38,.7,this.armorMat,-.62,.55,-.05);r.castShadow=!0;let i=this.box(.28,.28,.5,this.chassisMat,.58,.5,.12);i.castShadow=!0;let a=this.box(.16,.16,.95,this.accentMat,-.42,.55,-.85);a.castShadow=!0;let o=this.box(.22,.22,.28,this.chassisMat,-.42,.55,-.35);o.castShadow=!0;let s=new H(.11,.03,6,12);this.geometries.push(s);let c=new y(s,this.glowMat);c.position.set(-.42,.55,-1.35),c.rotation.y=Math.PI/2,this.cannonBody=a,this.cannonShroud=o,this.muzzleRing=c;let l=this.box(.38,.18,.42,this.visorMat,.05,.68,-.35),u=new P(.1,.14,.36,8);this.geometries.push(u);let d=new y(u,this.thrusterMat);d.rotation.x=Math.PI/2,d.position.set(-.28,.42,.78);let f=new y(u,this.thrusterMat);f.rotation.x=Math.PI/2,f.position.set(.22,.4,.72),this.thrusters.push(d,f);let p=new R(.08,.28,.55);this.geometries.push(p);let m=new y(p,this.accentMat);m.position.set(-.78,.5,.35),m.rotation.z=.35,m.castShadow=!0;let g=new y(p,this.accentMat);g.position.set(.72,.48,.4),g.rotation.z=-.25,g.castShadow=!0;let _=this.box(1,.05,.7,this.chassisMat,0,.22,.1);this.visual.add(t,n,r,i,a,o,c,l,d,f,m,g,_),this.group.add(this.visual),this.ringGeo=new Ke(.78,.9,40),this.ringMat=new w({color:`#22d3ee`,transparent:!0,opacity:.4,side:2,depthWrite:!1}),this.ring=new y(this.ringGeo,this.ringMat),this.ring.rotation.x=-Math.PI/2,this.ring.position.y=.03,this.group.add(this.ring),this.group.scale.setScalar(1.15),this.formGroups.push(this.buildFormTier1(),this.buildFormTier2(),this.buildFormTier3());for(let e of this.formGroups)e.visible=!1,this.visual.add(e)}setFormTier(e,t={weapon:0,defense:0,total:0}){let n=Math.max(0,Math.min(3,Math.floor(e)));this.formTier=n;for(let e=0;e<this.formGroups.length;e+=1)this.formGroups[e].visible=e<n;this.group.scale.setScalar([1.15,1.2,1.28,1.36][n]??1.15);let r=t.weapon,i=t.defense,a=`#22d3ee`,o=`#2dd4e8`;n>0&&(r>i+1?(a=`#fbbf24`,o=`#f59e0b`):i>r+1?(a=`#3ec6ff`,o=`#60a5fa`):t.total>=3&&(a=`#a78bfa`,o=`#c4b5fd`)),this.accentMat.color.set(a),this.accentMat.emissive.set(a),this.armorMat.color.set(o),this.armorMat.emissiveIntensity=.35+n*.12,this.glowMat.emissiveIntensity=1.4+n*.25,this.ringMat.color.set(a),this.ghostMat.color.set(a),this.ringGeo.dispose();let s=.78+n*.06;this.ringGeo=new Ke(s,s+.12,40),this.ring.geometry=this.ringGeo;for(let e of this.formAccents)e.color.set(a),e.emissive.set(a),e.emissiveIntensity=.9+n*.2;this.formAccent=a,this.applyWeaponVisual()}setWeaponVisual(e){this.weaponId=e,this.applyWeaponVisual()}applyWeaponVisual(){let e=this.weaponId,t=e===`rail`?`#fbbf24`:e===`scatter`?`#f472b6`:`#22d3ee`;e===`rail`?(this.cannonBody.scale.set(1.15,1.15,1.35),this.cannonBody.position.set(-.42,.55,-.95),this.cannonShroud.scale.set(1.25,1.25,1.6),this.cannonShroud.position.set(-.42,.55,-.25),this.muzzleRing.scale.set(1.35,1.35,1.35),this.muzzleRing.position.set(-.42,.55,-1.55),this.glowMat.emissiveIntensity=2):e===`scatter`?(this.cannonBody.scale.set(1.55,1.35,.72),this.cannonBody.position.set(-.42,.55,-.72),this.cannonShroud.scale.set(1.5,1.3,1.1),this.cannonShroud.position.set(-.42,.55,-.28),this.muzzleRing.scale.set(1.7,1.7,1.7),this.muzzleRing.position.set(-.42,.55,-1.18),this.glowMat.emissiveIntensity=1.6):(this.cannonBody.scale.set(1,1,1),this.cannonBody.position.set(-.42,.55,-.85),this.cannonShroud.scale.set(1,1,1),this.cannonShroud.position.set(-.42,.55,-.35),this.muzzleRing.scale.set(1,1,1),this.muzzleRing.position.set(-.42,.55,-1.35),this.glowMat.emissiveIntensity=1.4+this.formTier*.25),this.glowMat.color.set(t),this.glowMat.emissive.set(t),this.muzzleRing.material=this.glowMat,this.accentMat.color.set(t),this.accentMat.emissive.set(t),this.ringMat.color.set(t),this.ghostMat.color.set(t),this.formTier>0&&this.formAccent!==t?this.accentMat.emissiveIntensity=.2+this.formTier*.05:this.accentMat.emissiveIntensity=.18}getFormTier(){return this.formTier}buildFormTier1(){let e=new I,t=this.box(.5,.1,.55,this.armorMat,0,.62,.15);t.castShadow=!0;let n=this.box(.42,.08,.4,this.armorMat,0,.58,-.45),r=this.box(.12,.12,.55,this.accentMat,.48,.55,-.7);r.castShadow=!0;let i=this.makeFormAccentMat(),a=new H(.08,.025,6,10);this.geometries.push(a);let o=new y(a,i);return o.position.set(.48,.55,-1),o.rotation.y=Math.PI/2,e.add(t,n,r,o),e}buildFormTier2(){let e=new I,t=new R(.2,.2,.35);this.geometries.push(t);let n=new y(t,this.chassisMat);n.position.set(-.42,.55,-1.05);let r=new y(t,this.chassisMat);r.position.set(.48,.55,-.95);let i=new R(.06,.4,.7);this.geometries.push(i);let a=new y(i,this.makeFormAccentMat());a.position.set(-.95,.55,.1),a.rotation.z=.55;let o=new y(i,this.makeFormAccentMat());o.position.set(.9,.52,.15),o.rotation.z=-.55;let s=new P(.08,.11,.42,6);this.geometries.push(s);let c=new y(s,this.thrusterMat);c.rotation.x=Math.PI/2,c.position.set(-.55,.48,.65);let l=new y(s,this.thrusterMat);return l.rotation.x=Math.PI/2,l.position.set(.5,.46,.62),this.thrusters.push(c,l),e.add(n,r,a,o,c,l),e}buildFormTier3(){let e=new I,t=new R(.28,.32,.85);this.geometries.push(t);let n=new y(t,this.chassisMat);n.position.set(-.85,.55,-.05),n.castShadow=!0;let r=new y(t,this.chassisMat);r.position.set(.82,.52,-.02),r.castShadow=!0;let i=new R(.08,.35,.5);this.geometries.push(i);let a=new y(i,this.makeFormAccentMat());a.position.set(0,.85,.25);let o=new H(.55,.04,6,24);this.geometries.push(o);let s=new y(o,this.makeFormAccentMat());s.rotation.x=Math.PI/2,s.position.set(0,.35,.05);let c=this.box(1.15,.12,.35,this.armorMat,0,.68,.05);return e.add(n,r,a,s,c),e}makeFormAccentMat(){let e=new h({color:`#22d3ee`,emissive:`#22d3ee`,emissiveIntensity:1.1,roughness:.3,metalness:.4});return this.formAccents.push(e),e}spawnGhost(){let e=new I,t=new y(new R(.7,.25,.9),this.ghostMat.clone());if(t.position.y=.45,e.add(t),e.position.copy(this.group.position),e.rotation.y=this.group.rotation.y,this.group.add(e),this.ghosts.push({mesh:e,life:1}),this.ghosts.length>8){let e=this.ghosts.shift();e&&this.group.remove(e.mesh)}}box(e,t,n,r,i,a,o){let s=new R(e,t,n);this.geometries.push(s);let c=new y(s,r);return c.position.set(i,a,o),c.castShadow=!0,c.receiveShadow=!0,c}reset(){this.hp=this.stats.maxHp,this.shield=this.stats.maxShield,this.heat=0,this.overheated=!1,this.overheatEmp=!1,this.overheatPulse=!1,this.ultCharge=0,this.dashTimer=0,this.dashCooldown=0,this.fireCooldown=0,this.invulnTimer=0,this.recoil=0,this.alive=!0,this.group.visible=!0,this.group.position.set(0,0,0),this.group.rotation.set(0,0,0),this.visual.rotation.set(0,0,0),this.visual.position.set(0,0,0),this.velocity.set(0,0,0),this.aim.set(0,-1),this.setFormTier(0),this.stabilizeVisuals()}stabilizeVisuals(){this.group.position.y=0,this.visual.position.y=0,this.visual.rotation.z=0,this.visual.position.z=0,this.ringMat.opacity=.4}update(e,t,n,r,i,a,o){let s={fired:!1};if(this.overheatPulse=!1,!this.alive)return s;this.invulnTimer=Math.max(0,this.invulnTimer-e),this.dashCooldown=Math.max(0,this.dashCooldown-e),this.fireCooldown=Math.max(0,this.fireCooldown-e),this.recoil=Math.max(0,this.recoil-e*18),r.lengthSq()>.001&&this.aim.copy(r).normalize();let c=a&&this.dashCooldown<=0;c&&(this.dashTimer=this.stats.dashDuration,this.dashCooldown=this.stats.dashCooldown,this.invulnTimer=Math.max(this.invulnTimer,this.stats.dashDuration+.05),this.dashGhostTimer=0),this.dashGhostTimer-=e,this.dashTimer>0&&this.dashGhostTimer<=0&&(this.dashGhostTimer=.03,this.spawnGhost());for(let t=this.ghosts.length-1;t>=0;--t){let n=this.ghosts[t];n.life-=e*4;let r=n.mesh.children[0];if(r instanceof y){let e=r.material;e.opacity=Math.max(0,n.life)*.35}n.life<=0&&(this.group.remove(n.mesh),this.ghosts.splice(t,1))}let l=this.dashTimer>0?this.stats.dashSpeed*this.dashSpeedMul:this.stats.moveSpeed;this.dashTimer>0&&(this.dashTimer=Math.max(0,this.dashTimer-e));let u=new F(n.x,0,n.y).multiplyScalar(l);(c||this.dashTimer>0)&&n.lengthSq()<.01&&u.set(this.aim.x,0,this.aim.y).multiplyScalar(l);let d=1-Math.exp(-Math.max(1,this.moveAccel)*e);this.velocity.lerp(u,d),this.group.position.addScaledVector(this.velocity,e),this.group.position.x=D.clamp(this.group.position.x,-o.halfWidth+.8,o.halfWidth-.8),this.group.position.z=D.clamp(this.group.position.z,-o.halfDepth+.8,o.halfDepth-.8);let f=this.velocity.lengthSq()>1.5?new F(this.velocity.x*.35+this.aim.x,0,this.velocity.z*.35+this.aim.y):new F(this.aim.x,0,this.aim.y);f.lengthSq()>.001&&(this.group.rotation.y=Math.atan2(f.x,f.z));let p=Math.sin(t*9)*.04+Math.min(this.velocity.length()/80,.05);this.group.position.y=p;let m=D.clamp(this.velocity.x*-.04,-.28,.28);this.visual.rotation.z=D.lerp(this.visual.rotation.z,m,1-Math.exp(-10*e)),this.visual.position.z=-this.recoil*.12,this.visual.rotation.x=this.recoil*.15;let h=this.dashTimer>0?1:.55+Math.sin(t*12)*.08;for(let e of this.thrusters)e.material.emissiveIntensity=1.2+h*.8,e.scale.setScalar(1+h*.15);this.ringMat.opacity=this.invulnTimer>0?.85:.4,this.overheated?(this.heat=Math.max(0,this.heat-this.stats.overheatLockPerSec*e),this.heat<=0&&(this.overheated=!1)):this.heat=Math.max(0,this.heat-this.stats.heatCoolPerSec*e);let g=new F(this.aim.y,0,-this.aim.x);return this.muzzle.set(this.group.position.x+this.aim.x*1.1-g.x*.42,.55,this.group.position.z+this.aim.y*1.1-g.y*.42),i&&!this.overheated&&this.fireCooldown<=0&&(this.fireCooldown=this.stats.fireInterval,this.heat+=this.stats.heatPerShot,this.recoil=1,this.heat>=this.stats.maxHeat&&(this.heat=this.stats.maxHeat,this.overheatEmp?(this.heat=this.stats.maxHeat*.32,this.overheated=!1,this.overheatPulse=!0):this.overheated=!0),s.fired=!0),s}tryUltimate(){return!this.alive||this.ultCharge<100?!1:(this.ultCharge=0,!0)}addUltCharge(e){this.ultCharge=Math.min(100,this.ultCharge+e)}heal(e){this.hp=Math.min(this.stats.maxHp,this.hp+e)}addShield(e){this.shield=Math.min(this.stats.maxShield,this.shield+e)}coolHeat(e){this.heat=Math.max(0,this.heat-e),this.heat<this.stats.maxHeat*.35&&(this.overheated=!1)}takeDamage(e){if(!this.alive||this.invulnTimer>0)return{hit:!1,shieldBroke:!1};let t=this.shield,n=e;if(this.shield>0){let e=Math.min(this.shield,n);this.shield-=e,n-=e}let r=t>0&&this.shield<=0;return n>0&&(this.hp-=n),this.invulnTimer=this.stats.invulnAfterHit,this.chassisMat.emissive.set(`#ff2a4a`),this.chassisMat.emissiveIntensity=1.2,window.setTimeout(()=>{this.chassisMat.emissive.set(`#061018`),this.chassisMat.emissiveIntensity=.15},120),this.hp<=0&&(this.hp=0,this.alive=!1,this.group.visible=!1),{hit:!0,shieldBroke:r}}getHeatRatio(){return this.heat/this.stats.maxHeat}dispose(){for(let e of this.ghosts)this.group.remove(e.mesh);this.ghosts.length=0;for(let e of this.geometries)e.dispose();for(let e of this.formAccents)e.dispose();this.ringGeo.dispose(),this.chassisMat.dispose(),this.armorMat.dispose(),this.accentMat.dispose(),this.glowMat.dispose(),this.visorMat.dispose(),this.thrusterMat.dispose(),this.ghostMat.dispose(),this.ringMat.dispose()}},Ri={plasma:{coreScale:[1.05,1.05,1.2],trailScale:[.9,.9,1.4],trailOffsetZ:.42,trailOpacity:.5,radius:.13},rail:{coreScale:[.55,.55,2.4],trailScale:[.35,.35,3.2],trailOffsetZ:.9,trailOpacity:.72,radius:.1},scatter:{coreScale:[1.25,1.25,.85],trailScale:[.75,.75,.7],trailOffsetZ:.28,trailOpacity:.4,radius:.11},enemy:{coreScale:[1.4,1.4,1.35],trailScale:[1.1,1.1,1.1],trailOffsetZ:.35,trailOpacity:.4,radius:.16}},zi=class{group=new I;velocity=new F;active=!1;life=0;damage=0;owner=`player`;radius=.12;pierce=0;crit=!1;sourceWeapon=null;hitSet=new Set;hitsLanded=0;core;trail;coreGeo;trailGeo;coreMat;trailMat;constructor(){this.coreGeo=new Se(.11,10,8),this.trailGeo=new R(.06,.06,.55),this.coreMat=new w({color:`#22d3ee`}),this.trailMat=new w({color:`#22d3ee`,transparent:!0,opacity:.45}),this.core=new y(this.coreGeo,this.coreMat),this.trail=new y(this.trailGeo,this.trailMat),this.trail.position.z=.35,this.group.add(this.trail,this.core),this.group.visible=!1}fire(e,t,n,r,i,a,o){let s=o?.sourceWeapon,c=i===`enemy`?`enemy`:s===`rail`?`rail`:s===`scatter`?`scatter`:`plasma`,l=Ri[c];this.active=!0,this.life=c===`rail`?2.6:2.2,this.damage=r,this.owner=i,this.pierce=o?.pierce??0,this.crit=o?.crit??!1,this.sourceWeapon=s??null,this.hitSet.clear(),this.hitsLanded=0,this.group.visible=!0,this.group.position.copy(e),this.velocity.copy(t).normalize().multiplyScalar(n),this.coreMat.color.set(a),this.trailMat.color.set(a),this.trailMat.opacity=l.trailOpacity,this.radius=l.radius;let[u,d,f]=l.coreScale;this.core.scale.set(u,d,f);let[p,m,h]=l.trailScale;this.trail.scale.set(p,m,h),this.trail.position.z=l.trailOffsetZ,this.crit&&(this.core.scale.multiplyScalar(1.25),this.trailMat.opacity=Math.min(1,l.trailOpacity+.25)),this.group.rotation.set(0,0,0);let g=this.velocity.clone().normalize();this.group.lookAt(this.group.position.clone().add(g))}update(e){this.active&&(this.life-=e,this.group.position.addScaledVector(this.velocity,e),this.life<=0&&this.deactivate())}deactivate(){this.active=!1,this.group.visible=!1}dispose(){this.coreGeo.dispose(),this.trailGeo.dispose(),this.coreMat.dispose(),this.trailMat.dispose()}},Bi=class{scene;projectiles=[];constructor(e,t=280){this.scene=e;for(let n=0;n<t;n+=1){let t=new zi;this.projectiles.push(t),e.add(t.group)}}spawn(e,t,n,r,i,a,o){for(let s of this.projectiles)if(!s.active)return s.fire(e,t,n,r,i,a,o),s;return null}update(e){for(let t of this.projectiles)t.update(e)}clear(){for(let e of this.projectiles)e.deactivate()}activeCount(){let e=0;for(let t of this.projectiles)t.active&&(e+=1);return e}dispose(){for(let e of this.projectiles)this.scene.remove(e.group),e.dispose()}},Vi=class{context=null;unlocked=!1;muted=!1;constructor(){let e=()=>{this.unlock()};window.addEventListener(`pointerdown`,e,{once:!0}),window.addEventListener(`keydown`,e,{once:!0})}async unlock(){if(this.unlocked)return;let e=window.AudioContext||window.webkitAudioContext;e&&(this.context=new e,await this.context.resume(),this.unlocked=!0)}setMuted(e){this.muted=e}shoot(){this.blip(880,.04,`square`,.03,220)}hit(){this.blip(180,.05,`sawtooth`,.04,90)}kill(){this.blip(320,.12,`triangle`,.06,720)}hurt(){this.blip(120,.18,`sawtooth`,.07,60)}dash(){this.blip(240,.08,`sine`,.05,640)}ult(){this.blip(90,.35,`sawtooth`,.08,40)}overheat(){this.blip(200,.25,`square`,.05,50)}pickup(){this.blip(520,.1,`triangle`,.05,900)}pickupChain(e){let t=480+Math.min(e,8)*40;this.blip(t,.1,`triangle`,.05,t*1.6)}wave(){this.blip(440,.15,`sine`,.05,660)}boss(){this.blip(70,.5,`sawtooth`,.09,40)}death(){this.blip(160,.6,`sawtooth`,.09,30)}dispose(){this.context?.close(),this.context=null}blip(e,t,n,r,i){if(this.muted||!this.context||this.context.state!==`running`)return;let a=this.context.createOscillator(),o=this.context.createGain(),s=this.context.currentTime;a.type=n,a.frequency.setValueAtTime(e,s),a.frequency.exponentialRampToValueAtTime(Math.max(20,i),s+t),o.gain.setValueAtTime(1e-4,s),o.gain.exponentialRampToValueAtTime(r,s+.01),o.gain.exponentialRampToValueAtTime(1e-4,s+t),a.connect(o).connect(this.context.destination),a.start(s),a.stop(s+t+.02)}},Hi=class{camera;desiredPosition=new F;lookTarget=new F;shake=new F;baseOffset=new F(0,13.5,12);constructor(e){this.camera=e}snapTo(e){this.desiredPosition.copy(e).add(this.baseOffset),this.camera.position.copy(this.desiredPosition),this.lookTarget.copy(e).add(new F(0,.4,0)),this.camera.lookAt(this.lookTarget)}update(e,t,n,r){this.desiredPosition.copy(t).add(this.baseOffset).add(r);let i=1-Math.exp(-e/Math.max(.001,n));this.camera.position.lerp(this.desiredPosition,i),this.lookTarget.copy(t).add(new F(0,.4,-1)),this.camera.lookAt(this.lookTarget),this.shake.copy(r)}applyFovPunch(e,t){this.camera.fov=t+e,this.camera.updateProjectionMatrix()}},Ui=class{baseFov;camera;hitstopTimer=0;fovPunch=0;hurtFlash=0;slowmoTimer=0;slowmoScale=1;constructor(e,t){this.baseFov=e,this.camera=t}triggerHitstop(e){e>this.hitstopTimer&&(this.hitstopTimer=e)}triggerSlowmo(e,t=.35){this.slowmoTimer=Math.max(this.slowmoTimer,e),this.slowmoScale=t}triggerFovPunch(e=3.5){this.fovPunch=Math.min(8,this.fovPunch+e)}triggerHurtFlash(e=.85){this.hurtFlash=Math.min(1,this.hurtFlash+e)}isSlowmo(){return this.slowmoTimer>0}consumeWorldDelta(e){return this.hitstopTimer>0?(this.hitstopTimer=Math.max(0,this.hitstopTimer-e),0):this.slowmoTimer>0?(this.slowmoTimer=Math.max(0,this.slowmoTimer-e),e*this.slowmoScale):e}update(e){this.fovPunch=Math.max(0,this.fovPunch-e*22),this.hurtFlash=Math.max(0,this.hurtFlash-e*2.8),this.camera.fov=this.baseFov+this.fovPunch,this.camera.updateProjectionMatrix()}getHurtFlash(){return this.hurtFlash}reset(){this.hitstopTimer=0,this.fovPunch=0,this.hurtFlash=0,this.slowmoTimer=0,this.camera.fov=this.baseFov,this.camera.updateProjectionMatrix()}},Wi=class{scene;capacity;active=[];pool=[];geo;mats=new Map;constructor(e,t=40){this.scene=e,this.capacity=t,this.geo=new Ne(.35,16)}mat(e,t){let n=`${e}|${t.toFixed(2)}`,r=this.mats.get(n);return r||(r=new w({color:e,transparent:!0,opacity:t,depthWrite:!1,side:2}),this.mats.set(n,r)),r}spawn(e,t=`#1a1010`,n=1,r=12){if(this.active.length>=this.capacity){let e=this.active.shift();e&&(e.mesh.visible=!1,this.pool.push(e.mesh))}let i=this.pool.pop();i||(i=new y(this.geo,this.mat(t,.55)),i.rotation.x=-Math.PI/2,this.scene.add(i)),i.material=this.mat(t,.5),i.position.set(e.x,.02,e.z),i.rotation.z=Math.random()*Math.PI,i.scale.setScalar(n),i.visible=!0,this.active.push({mesh:i,life:r,maxLife:r})}spawnScorch(e){this.spawn(e,`#0a0808`,.8+Math.random()*.6,14)}spawnImpact(e,t){this.spawn(e,t,.45+Math.random()*.35,6)}update(e){for(let t=this.active.length-1;t>=0;--t){let n=this.active[t];n.life-=e,n.life<=0&&(n.mesh.visible=!1,this.pool.push(n.mesh),this.active.splice(t,1))}}reset(){for(let e of this.active)e.mesh.visible=!1,this.pool.push(e.mesh);this.active.length=0}dispose(){this.reset();for(let e of this.pool)this.scene.remove(e);this.pool.length=0,this.geo.dispose();for(let e of this.mats.values())e.dispose();this.mats.clear()}},Gi=`mlg-locale`,Ki={hull:`装甲`,shield:`护盾`,heat:`热量`,wave:`波次`,time:`时间`,score:`分数`,combo:`连击`,ult:`大招`,foes:`敌军`,statusDead:`系统离线`,statusUpgrade:`选择一个改装模块`,statusCooling:`武器冷却中`,statusBoss:`摧毁攻城核心`,statusStress:`极限压力：守住阵地`,statusInbound:`下一波即将来袭`,statusHold:`守住竞技场`,upgradeKicker:`波次清除`,upgradeTitle:e=>`第 ${e} 波 · 选择改装`,upgradeSub:`选择一个模块 · 按 1 / 2 / 3`,stackLabel:(e,t)=>`层数 ${e} → ${t}`,paused:`已暂停`,pausedStress:`已暂停 · 极限压力`,gameTitle:`霓虹攻城竞技场`,resume:`继续`,restart:`重开`,hullBreached:`装甲击穿`,terminatedBy:e=>`被 ${e} 终结`,retry:`再来一局`,stressMode:`极限压力`,statWave:`波次`,statScore:`分数`,statKills:`击杀`,statTime:`时间`,statPeakCombo:`最高连击`,statThreat:`威胁`,toggleStress:`极限压力（敌潮拉满）`,toggleGraphics:`低画质`,toggleLang:`语言`,hint:`WASD 移动 · 鼠标瞄准 · 按住射击 · Shift 冲刺 · Q 大招 · P 暂停 · R 重开`,waveBanner:e=>`第 ${e} 波`,bossBanner:e=>`首领 · 第 ${e} 波`,hostilesEvolved:e=>`敌军进化 · T${e}`,ultReady:`大招就绪`,titanReinforcements:`泰坦增援`,bossPhase:(e,t)=>`首领阶段 ${e} · ${t}`,titanName:e=>`TITAN-07 · ${e}`,overheatEmp:`过热 · 电磁脉冲`,empCascade:`电磁级联`,shieldNova:`护盾新星`,modPick:e=>`改装 · ${e}`,weaponPick:e=>`武器 · ${e}`,killCount:e=>`×${e} 敌军`,killElite:`精英击破`,killRanged:`狙击手清除`,killBoss:`攻城核心击毁`,pickupShield:`护盾 +20`,pickupCoolant:`冷却冲洗`,pickupHeal:`维修 +25`,pickupUlt:`大招 +25`,pickupGeneric:`补给`,weaponPlasma:`等离子连发`,weaponRail:`轨道炮`,weaponScatter:`霰弹枪`,weaponPlasmaShort:`等离子`,weaponRailShort:`轨道`,weaponScatterShort:`霰弹`,phaseSweep:`横扫`,phaseLockdown:`封锁`,phaseOverdrive:`过载`,upgrades:{overclock:{name:`超频`,desc:`射速 +10%（全武器）`},thrusters:{name:`推进器`,desc:`移动速度 +0.45`},armor:{name:`装甲板`,desc:`最大装甲 +20 · 修复 20`},shield_bank:{name:`护盾仓`,desc:`最大护盾 +15 · 充能 15`},coolant_loop:{name:`冷却环`,desc:`热量冷却 +7/秒`},capacitor:{name:`电容`,desc:`最大热量 +12`},dash_servos:{name:`冲刺舵机`,desc:`冲刺冷却 −12%`},mag_accel:{name:`磁轨加速`,desc:`弹速 +8%（全武器）`},arc_capacitor:{name:`电弧电容`,desc:`击杀连锁闪电 +1 目标`},overheat_cascade:{name:`过热级联`,desc:`过热改为电磁脉冲`},critical_conductor:{name:`暴击导体`,desc:`连锁命中可暴击 ×1.5`},rail_bore:{name:`轨道膛线`,desc:`轨道炮穿透 +1 · 伤害 +2`},rail_reactor:{name:`轨道反应堆`,desc:`轨道炮击杀返还 20% 热量`},scatter_choke:{name:`霰弹收束`,desc:`霰弹更集中 · 近距加成`},dash_detonation:{name:`冲刺引爆`,desc:`冲刺留下延迟爆炸`},shield_nova:{name:`护盾新星`,desc:`护盾击破时释放新星`}}},qi={hull:`HULL`,shield:`SHIELD`,heat:`HEAT`,wave:`WAVE`,time:`TIME`,score:`SCORE`,combo:`COMBO`,ult:`ULT`,foes:`FOES`,statusDead:`Systems offline`,statusUpgrade:`Select a retrofit module`,statusCooling:`Cooling weapon`,statusBoss:`Destroy the Siege Core`,statusStress:`STRESS: hold the line`,statusInbound:`Next wave inbound`,statusHold:`Hold the arena`,upgradeKicker:`WAVE CLEARED`,upgradeTitle:e=>`WAVE ${e} · SELECT RETROFIT`,upgradeSub:`Pick one module · 1 / 2 / 3`,stackLabel:(e,t)=>`Stack ${e} → ${t}`,paused:`PAUSED`,pausedStress:`PAUSED · STRESS`,gameTitle:`Neon Siege Arena`,resume:`Resume`,restart:`Restart`,hullBreached:`HULL BREACHED`,terminatedBy:e=>`Terminated by ${e}`,retry:`Retry`,stressMode:`Stress Mode`,statWave:`Wave`,statScore:`Score`,statKills:`Kills`,statTime:`Time`,statPeakCombo:`Peak Combo`,statThreat:`Threat`,toggleStress:`Stress (max enemy flood)`,toggleGraphics:`Low Graphics`,toggleLang:`Language`,hint:`WASD move · Mouse aim · Hold fire · Shift dash · Q ult · P pause · R restart`,waveBanner:e=>`WAVE ${e}`,bossBanner:e=>`BOSS · WAVE ${e}`,hostilesEvolved:e=>`HOSTILES EVOLVED · T${e}`,ultReady:`ULT READY`,titanReinforcements:`TITAN REINFORCEMENTS`,bossPhase:(e,t)=>`BOSS PHASE ${e} · ${t}`,titanName:e=>`TITAN-07 · ${e}`,overheatEmp:`OVERHEAT · EMP`,empCascade:`EMP CASCADE`,shieldNova:`SHIELD NOVA`,modPick:e=>`MOD · ${e}`,weaponPick:e=>`WEAPON · ${e}`,killCount:e=>`×${e} HOSTILES`,killElite:`ELITE SHATTERED`,killRanged:`SNIPER PICKED`,killBoss:`SIEGE CORE DOWN`,pickupShield:`SHIELD +20`,pickupCoolant:`COOLANT FLUSH`,pickupHeal:`REPAIR +25`,pickupUlt:`ULT +25`,pickupGeneric:`PICKUP`,weaponPlasma:`Plasma Repeater`,weaponRail:`Railgun`,weaponScatter:`Scattergun`,weaponPlasmaShort:`PLS`,weaponRailShort:`RAIL`,weaponScatterShort:`SCT`,phaseSweep:`SWEEP`,phaseLockdown:`LOCKDOWN`,phaseOverdrive:`OVERDRIVE`,upgrades:{overclock:{name:`Overclock`,desc:`Fire rate +10% (all weapons)`},thrusters:{name:`Thrusters`,desc:`Move speed +0.45`},armor:{name:`Armor Plate`,desc:`Max hull +20 · repair 20`},shield_bank:{name:`Shield Bank`,desc:`Max shield +15 · charge 15`},coolant_loop:{name:`Coolant Loop`,desc:`Heat cooling +7/s`},capacitor:{name:`Capacitor`,desc:`Max heat +12`},dash_servos:{name:`Dash Servos`,desc:`Dash cooldown −12%`},mag_accel:{name:`Mag Accelerator`,desc:`Projectile speed +8% (all weapons)`},arc_capacitor:{name:`Arc Capacitor`,desc:`Kills chain lightning to +1 nearby`},overheat_cascade:{name:`Overheat Cascade`,desc:`Overheat becomes EMP blast`},critical_conductor:{name:`Critical Conductor`,desc:`Chain hits may crit ×1.5`},rail_bore:{name:`Rail Bore`,desc:`Rail pierce +1 · rail damage +2 only`},rail_reactor:{name:`Rail Reactor`,desc:`Rail kills refund 20% heat`},scatter_choke:{name:`Scatter Choke`,desc:`Scatter tighter + close bonus only`},dash_detonation:{name:`Dash Detonation`,desc:`Dash leaves a delayed blast`},shield_nova:{name:`Shield Nova`,desc:`Shield break emits a nova`}}},Ji={zh:Ki,en:qi};function Yi(){try{let e=localStorage.getItem(Gi);if(e===`zh`||e===`en`)return e}catch{}return`zh`}var Xi=Yi(),Zi=new Set;function Qi(e){if(e!==Xi){Xi=e;try{localStorage.setItem(Gi,e)}catch{}document.documentElement.lang=e===`zh`?`zh-CN`:`en`;for(let t of Zi)t(e)}}function $i(){return Qi(Xi===`zh`?`en`:`zh`),Xi}function ea(e){return Zi.add(e),()=>Zi.delete(e)}function Q(){return Ji[Xi]}function ta(e){return Ji[Xi].upgrades[e]||(qi.upgrades[e]??{name:e,desc:``})}function na(e){return e===2?Q().phaseLockdown:e===3?Q().phaseOverdrive:Q().phaseSweep}function ra(e){return e===`rail`?Q().weaponRail:e===`scatter`?Q().weaponScatter:Q().weaponPlasma}function ia(e){return e===`rail`?Q().weaponRailShort:e===`scatter`?Q().weaponScatterShort:Q().weaponPlasmaShort}function aa(){document.documentElement.lang=Xi===`zh`?`zh-CN`:`en`;let e=Q(),t={"label.hull":e.hull,"label.shield":e.shield,"label.heat":e.heat,"label.wave":e.wave,"label.time":e.time,"label.score":e.score,"label.combo":e.combo,"label.ult":e.ult,"label.foes":e.foes,"upgrade.kicker":e.upgradeKicker,"upgrade.sub":e.upgradeSub,"toggle.stress":e.toggleStress,"toggle.graphics":e.toggleGraphics,"overlay.hint":e.hint,"lang.toggle":Xi===`zh`?`EN`:`中文`,"toggle.lang":e.toggleLang,"weapon.plasma":e.weaponPlasmaShort,"weapon.rail":e.weaponRailShort,"weapon.scatter":e.weaponScatterShort};for(let[e,n]of Object.entries(t))document.querySelectorAll(`[data-i18n="${e}"]`).forEach(e=>{e.textContent=n});let n={plasma:`${e.weaponPlasma} — 1`,rail:`${e.weaponRail} — 2`,scatter:`${e.weaponScatter} — 3`};document.querySelectorAll(`.weapon-chip`).forEach(e=>{let t=e.dataset.weapon??`plasma`,r=ia(t),i=e.querySelector(`.weapon-short`);i&&(i.textContent=r),n[t]&&(e.title=n[t])})}var oa=class{els={hpText:this.el(`#hp-text`),hpFill:this.el(`#hp-fill`),shieldText:this.el(`#shield-text`),shieldFill:this.el(`#shield-fill`),heatText:this.el(`#heat-text`),heatFill:this.el(`#heat-fill`),waveValue:this.el(`#wave-value`),timerValue:this.el(`#timer-value`),scoreValue:this.el(`#score-value`),comboValue:this.el(`#combo-value`),comboBlock:this.el(`#combo-block`),comboPips:this.el(`#combo-pips`),ultReadout:this.el(`#ult-readout`),ultRing:this.el(`#ult-ring-fill`),enemiesValue:this.el(`#enemies-value`),statusLine:this.el(`#status-line`),bossBar:this.el(`#boss-bar`),bossFill:this.el(`#boss-fill`),bossName:this.el(`#boss-name`),overheat:this.el(`#overheat-banner`),waveBanner:this.el(`#wave-banner`),killFeed:this.el(`#kill-feed`),ultFlash:this.el(`#ult-flash`),overlay:this.el(`#overlay`),overlayTitle:this.el(`#overlay-title`),overlaySub:this.el(`#overlay-sub`),overlayStats:this.el(`#overlay-stats`),overlayPrimary:this.el(`#overlay-primary`),overlaySecondary:this.el(`#overlay-secondary`),stressToggle:this.el(`#stress-toggle`),gfxToggle:this.el(`#gfx-toggle`),stressBadge:this.el(`#stress-badge`),perfHud:this.el(`#perf-hud`),perfFps:this.el(`#perf-fps`),perfCalls:this.el(`#perf-calls`),perfTris:this.el(`#perf-tris`),perfFoes:this.el(`#perf-foes`),upgradePanel:this.el(`#upgrade-panel`),upgradeCards:this.el(`#upgrade-cards`),upgradeTitle:this.el(`#upgrade-title`),weaponBar:this.el(`#weapon-bar`),langButton:this.el(`#lang-toggle`),langButtonOverlay:this.el(`#lang-toggle-overlay`)};waveBannerTimer=0;ultCircumference=2*Math.PI*18;onPrimary=()=>void 0;onSecondary=()=>void 0;onStress=()=>void 0;onGraphics=()=>void 0;onUpgradePick=()=>void 0;onWeaponPick=()=>void 0;onLocaleToggle=()=>void 0;constructor(){this.els.overlayPrimary.addEventListener(`click`,()=>this.onPrimary()),this.els.overlaySecondary.addEventListener(`click`,()=>this.onSecondary()),this.els.stressToggle.addEventListener(`change`,()=>this.onStress(this.els.stressToggle.checked)),this.els.gfxToggle.addEventListener(`change`,()=>this.onGraphics(this.els.gfxToggle.checked)),this.els.langButton.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),this.onLocaleToggle()}),this.els.langButtonOverlay.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),this.onLocaleToggle()}),this.els.weaponBar.querySelectorAll(`.weapon-chip`).forEach((e,t)=>{e.addEventListener(`click`,()=>this.onWeaponPick(t))});for(let e=0;e<8;e+=1){let e=document.createElement(`i`);this.els.comboPips.appendChild(e)}this.els.ultRing.style.strokeDasharray=String(this.ultCircumference),aa(),ea(()=>{aa(),this.refreshUpgradeChrome()})}setWeaponPickHandler(e){this.onWeaponPick=e}setLocaleToggleHandler(e){this.onLocaleToggle=e}setActiveWeapon(e){this.els.weaponBar.querySelectorAll(`.weapon-chip`).forEach(t=>{t.classList.toggle(`active`,t.dataset.weapon===e)})}setOverlayHandlers(e,t){this.onPrimary=e,this.onSecondary=t}setStressHandler(e){this.onStress=e}setGraphicsHandler(e){this.onGraphics=e}setUpgradePickHandler(e){this.onUpgradePick=e}refreshUpgradeChrome(){let e=this.els.upgradePanel.querySelector(`.upgrade-kicker`);e&&(e.textContent=Q().upgradeKicker);let t=this.els.upgradePanel.querySelector(`#upgrade-sub`);t&&(t.textContent=Q().upgradeSub)}showUpgradeCards(e,t){this.els.upgradeTitle.textContent=Q().upgradeTitle(t),this.refreshUpgradeChrome(),this.els.upgradeCards.innerHTML=``,e.forEach((e,t)=>{let n=document.createElement(`button`);n.type=`button`,n.className=`upgrade-card`,n.style.setProperty(`--card-accent`,e.color),n.innerHTML=`
        <span class="key">${t+1}</span>
        <h3></h3>
        <p></p>
        <span class="stack"></span>
      `;let r=n.querySelector(`h3`),i=n.querySelector(`p`),a=n.querySelector(`.stack`);r&&(r.textContent=e.name),i&&(i.textContent=e.desc),a&&(a.textContent=e.stackLabel),n.addEventListener(`click`,()=>this.onUpgradePick(t)),this.els.upgradeCards.appendChild(n)}),this.els.upgradePanel.classList.remove(`hidden`)}hideUpgradeCards(){this.els.upgradePanel.classList.add(`hidden`),this.els.upgradeCards.innerHTML=``}setStressVisible(e){this.els.stressBadge.classList.toggle(`hidden`,!e),this.els.stressToggle.checked=e}showWaveBanner(e,t=!1){this.waveBannerTimer=1.6,this.els.waveBanner.textContent=e,this.els.waveBanner.classList.remove(`hidden`,`boss`),t&&this.els.waveBanner.classList.add(`boss`),this.els.waveBanner.style.animation=`none`,this.els.waveBanner.offsetWidth,this.els.waveBanner.style.animation=``}popScore(e){e>=200&&(this.els.statusLine.textContent=`+${e}`,this.els.statusLine.style.borderBottomColor=`#fbbf24`,window.setTimeout(()=>{this.els.statusLine.style.borderBottomColor=``},400))}flashUlt(){let e=this.els.ultFlash;e.classList.remove(`hidden`),e.style.animation=`none`,e.offsetWidth,e.style.animation=``,window.setTimeout(()=>e.classList.add(`hidden`),420)}pushKillFeed(e,t){let n=document.createElement(`div`);for(n.className=`kill-feed-item ${t}`,n.textContent=e,this.els.killFeed.appendChild(n);this.els.killFeed.children.length>5;)this.els.killFeed.removeChild(this.els.killFeed.firstChild);window.setTimeout(()=>n.remove(),2200)}flashPickup(e,t){let n=document.createElement(`div`);for(n.className=`kill-feed-item pickup`,n.style.borderLeftColor=t,n.style.color=t,n.textContent=`◆ ${e}`,this.els.killFeed.appendChild(n);this.els.killFeed.children.length>5;)this.els.killFeed.removeChild(this.els.killFeed.firstChild);this.els.statusLine.textContent=e,this.els.statusLine.style.borderBottomColor=t,window.setTimeout(()=>{n.remove(),this.els.statusLine.style.borderBottomColor=``},1600)}setPerfVisible(e){this.els.perfHud.classList.toggle(`hidden`,!e)}updatePerf(e,t,n,r){this.els.perfFps.textContent=String(Math.round(e)),this.els.perfCalls.textContent=String(t),this.els.perfTris.textContent=n>999?`${(n/1e3).toFixed(1)}k`:String(n),this.els.perfFoes.textContent=String(r)}update(e,t){let{els:n}=this,r=Q();n.hpText.textContent=String(Math.ceil(e.hp)),n.hpFill.style.transform=`scaleX(${Math.max(0,e.hp/e.maxHp)})`,n.shieldText.textContent=String(Math.ceil(e.shield)),n.shieldFill.style.transform=`scaleX(${Math.max(0,e.shield/e.maxShield)})`,n.heatText.textContent=`${Math.round(e.heat/e.maxHeat*100)}%`,n.heatFill.style.transform=`scaleX(${Math.max(0,e.heat/e.maxHeat)})`,n.waveValue.textContent=String(e.wave);let i=Math.floor(e.time/60).toString().padStart(2,`0`),a=Math.floor(e.time%60).toString().padStart(2,`0`);n.timerValue.textContent=`${i}:${a}`,n.scoreValue.textContent=String(e.score),n.comboValue.textContent=`×${e.combo.toFixed(1)}`,n.comboBlock.classList.toggle(`hot`,e.combo>=2),n.comboBlock.classList.toggle(`crit`,e.combo>=4);let o=n.comboPips.children,s=Math.min(8,Math.floor(e.combo));for(let e=0;e<o.length;e+=1)o[e].classList.toggle(`on`,e<s);let c=Math.max(0,e.ult/100);n.ultRing.style.strokeDashoffset=String(this.ultCircumference*(1-c)),n.ultReadout.classList.toggle(`ready`,e.ult>=100),n.enemiesValue.textContent=String(e.enemies),n.statusLine.textContent=e.status,n.stressBadge.classList.toggle(`hidden`,!e.stress),e.weapon&&this.setActiveWeapon(e.weapon),e.boss.visible?(n.bossBar.classList.remove(`hidden`),n.bossName.textContent=e.boss.name,n.bossFill.style.transform=`scaleX(${Math.max(0,e.boss.hpRatio)})`):n.bossBar.classList.add(`hidden`),n.overheat.classList.toggle(`hidden`,!e.overheated),this.waveBannerTimer>0?(this.waveBannerTimer-=t,this.waveBannerTimer<=0&&n.waveBanner.classList.add(`hidden`)):e.waveBanner&&this.showWaveBanner(e.waveBanner),e.mode===`play`?(n.overlay.classList.add(`hidden`),this.hideUpgradeCards()):e.mode===`upgrade`?n.overlay.classList.add(`hidden`):(this.hideUpgradeCards(),n.overlay.classList.remove(`hidden`),e.mode===`paused`?(n.overlayTitle.textContent=e.stress?r.pausedStress:r.paused,n.overlaySub.textContent=r.gameTitle,n.overlayPrimary.textContent=r.resume,n.overlaySecondary.textContent=r.restart):(n.overlayTitle.textContent=r.hullBreached,n.overlaySub.textContent=r.terminatedBy(e.deathCause),n.overlayPrimary.textContent=r.retry,n.overlaySecondary.textContent=r.stressMode),n.overlayStats.innerHTML=`
        <div>${r.statWave}<strong>${e.wave}</strong></div>
        <div>${r.statScore}<strong>${e.score}</strong></div>
        <div>${r.statKills}<strong>${e.kills}</strong></div>
        <div>${r.statTime}<strong>${i}:${a}</strong></div>
        <div>${r.statPeakCombo}<strong>×${e.peakCombo.toFixed(1)}</strong></div>
        <div>${r.statThreat}<strong>${e.deathCause}</strong></div>
      `)}el(e){let t=document.querySelector(e);if(!t)throw Error(`Missing HUD element: ${e}`);return t}},sa={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},ca=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},la=new Ee(-1,1,1,-1,0,1),ua=new class extends Ye{constructor(){super(),this.setAttribute(`position`,new g([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new g([0,2,0,0,2,0],2))}},da=class{constructor(e){this._mesh=new y(ua,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,la)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},fa=class extends ca{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof B?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=k.clone(e.uniforms),this.material=new B({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new da(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},pa=class extends ca{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},ma=class extends ca{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},ha=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new _);this._width=n.width,this._height=n.height,t=new Ve(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:fe}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new fa(sa),this.copyPass.material.blending=0,this.timer=new c}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}pa!==void 0&&(r instanceof pa?n=!0:r instanceof ma&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new _);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},ga=class extends ca{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new z}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},_a={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new z(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},va=class e extends ca{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new _(256,256):new _(e.x,e.y),this.clearColor=new z(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Ve(i,a,{type:fe}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new Ve(i,a,{type:fe});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new Ve(i,a,{type:fe});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=_a;this.highPassUniforms=k.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new B({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new _(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=k.clone(sa.uniforms),this.blendMaterial=new B({uniforms:this.copyUniforms,vertexShader:sa.vertexShader,fragmentShader:sa.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new z,this._oldClearAlpha=1,this._basic=new w,this._fsQuad=new da(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new _(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new B({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new _(.5,.5)},direction:{value:new _(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new B({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};va.BlurDirectionX=new _(1,0),va.BlurDirectionY=new _(0,1);var ya={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},ba=class extends ca{constructor(){super(),this.isOutputPass=!0,this.uniforms=k.clone(ya.uniforms),this.material=new ve({name:ya.name,uniforms:this.uniforms,vertexShader:ya.vertexShader,fragmentShader:ya.fragmentShader}),this._fsQuad=new da(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Y.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},xa=class{renderer;scene;camera;composer=null;bloom=null;enabled=!0;constructor(e,t,n){this.renderer=e,this.scene=t,this.camera=n,this.setup()}setup(){try{let e=new ha(this.renderer);e.addPass(new ga(this.scene,this.camera));let t=new va(new _(1,1),.42,.5,.82);e.addPass(t),e.addPass(new ba),this.composer=e,this.bloom=t}catch{this.composer=null,this.bloom=null,this.enabled=!1}}setSize(e,t,n){this.composer?.setPixelRatio(n),this.composer?.setSize(e,t),this.bloom?.setSize(e,t)}setEnabled(e){this.enabled=e}setLowPower(e){this.bloom&&(this.bloom.strength=e?.18:.38,this.bloom.radius=e?.25:.55)}render(){return!this.enabled||!this.composer?!1:(this.composer.render(),!0)}dispose(){this.composer?.dispose(),this.bloom?.dispose(),this.composer=null,this.bloom=null}},Sa=class{scene;rng;bursts=[];shocks=[];dummy=new M;color=new z;trauma=0;mesh;geometry=new Se(.08,5,4);material=new w({color:`#ffffff`,transparent:!0,opacity:.95,depthWrite:!1});constructor(e,t=Math.random,n=4e3){this.scene=e,this.rng=t,this.mesh=new je(this.geometry,this.material,n),this.mesh.instanceMatrix.setUsage(C),this.mesh.frustumCulled=!1,this.mesh.count=0,this.mesh.castShadow=!1,this.mesh.receiveShadow=!1,e.add(this.mesh)}spawnBurst(e,t,n=10,r=6){this.color.set(t);let i=this.color.r,a=this.color.g,o=this.color.b,s=Math.max(0,this.mesh.instanceMatrix.count-this.bursts.length),c=Math.min(n,s);for(let t=0;t<c;t+=1){let t=this.rng()*Math.PI*2,n=Math.acos(2*this.rng()-1),s=r*(.4+this.rng()*.8),c=.35+this.rng()*.35;this.bursts.push({x:e.x,y:e.y,z:e.z,vx:Math.sin(n)*Math.cos(t)*s,vy:Math.abs(Math.cos(n))*s*.6,vz:Math.sin(n)*Math.sin(t)*s,life:c,maxLife:c,scale:.7+this.rng()*.8,r:i,g:a,b:o})}}spawnShockwave(e,t,n=7){if(this.shocks.length>24)return;let r=new Ke(.2,.45,32),i=new w({color:t,transparent:!0,opacity:.85,side:2,depthWrite:!1}),a=new y(r,i);a.rotation.x=-Math.PI/2,a.position.set(e.x,.08,e.z),this.scene.add(a),this.shocks.push({mesh:a,geo:r,mat:i,start:performance.now(),radius:n}),this.addTrauma(.35)}killChaser(e){this.spawnBurst(e.clone().setY(.4),`#ef4444`,16,8),this.spawnBurst(e.clone().setY(.3),`#fbbf24`,8,5),this.spawnShockwave(e,`#ef4444`,2.2),this.addTrauma(.14)}killRanged(e){this.spawnBurst(e.clone().setY(.55),`#a78bfa`,18,6),this.spawnShockwave(e,`#c4b5fd`,3.2),this.addTrauma(.12)}killElite(e){this.spawnBurst(e.clone().setY(.6),`#f59e0b`,22,9),this.spawnBurst(e.clone().setY(.4),`#e8eef7`,10,7),this.spawnShockwave(e,`#f59e0b`,4.5),this.addTrauma(.28)}killBoss(e){this.spawnBurst(e.clone().setY(.9),`#f43f5e`,36,12),this.spawnBurst(e.clone().setY(.6),`#fbbf24`,24,10),this.spawnShockwave(e,`#f43f5e`,8),window.setTimeout(()=>this.spawnShockwave(e,`#fbbf24`,6),80),this.addTrauma(.7)}pickupPop(e,t=`#4ade80`){this.spawnBurst(e.clone().setY(.7),t,14,5)}ultWarning(e){this.spawnShockwave(e,`#a78bfa`,10)}addTrauma(e){this.trauma=Math.min(1,this.trauma+e)}getShakeOffset(e,t){this.trauma=Math.max(0,this.trauma-.9/60);let n=this.trauma*this.trauma;return t.set(Math.sin(e*31)*n*.45,Math.sin(e*27)*n*.2,Math.cos(e*29)*n*.45),t}activeCount(){return this.bursts.length}update(e){for(let t=this.bursts.length-1;t>=0;--t){let n=this.bursts[t];if(n.life-=e,n.vy-=12*e,n.x+=n.vx*e,n.y+=n.vy*e,n.z+=n.vz*e,n.y<.05&&(n.y=.05,n.vy*=-.35,n.vx*=.7,n.vz*=.7),n.life<=0){let e=this.bursts.pop();e&&e!==n&&(this.bursts[t]=e)}}let t=this.mesh.instanceMatrix.count,n=Math.min(this.bursts.length,t);for(let e=0;e<n;e+=1){let t=this.bursts[e],n=Math.max(0,t.life/Math.max(t.maxLife,1e-4));this.dummy.position.set(t.x,t.y,t.z),this.dummy.scale.setScalar(t.scale*n),this.dummy.rotation.set(0,0,0),this.dummy.updateMatrix(),this.mesh.setMatrixAt(e,this.dummy.matrix),this.mesh.setColorAt(e,this.color.setRGB(t.r,t.g,t.b))}this.mesh.count=n,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0);for(let e=this.shocks.length-1;e>=0;--e){let t=this.shocks[e],n=(performance.now()-t.start)/450;if(n>=1){this.scene.remove(t.mesh),t.geo.dispose(),t.mat.dispose(),this.shocks.splice(e,1);continue}t.mesh.scale.setScalar(1+n*t.radius),t.mat.opacity=.85*(1-n)}}reset(){this.bursts.length=0,this.mesh.count=0,this.trauma=0;for(let e of this.shocks)this.scene.remove(e.mesh),e.geo.dispose(),e.mat.dispose();this.shocks.length=0}dispose(){this.reset(),this.scene.remove(this.mesh),this.geometry.dispose(),this.material.dispose()}},Ca=class{scene;rng;bounds;dust;dustMat;pulseTimer=2;pulsePool=[];pulseGeo=new Ke(.4,.55,48);farGroup=new I;constructor(e,t,n){this.scene=e,this.rng=t,this.bounds=n;let r=new Float32Array(540);for(let e=0;e<180;e+=1)r[e*3]=(this.rng()-.5)*n.halfWidth*2.2,r[e*3+1]=.3+this.rng()*3.5,r[e*3+2]=(this.rng()-.5)*n.halfDepth*2.2;let i=new Ye;i.setAttribute(`position`,new U(r,3)),this.dustMat=new Ie({color:`#7ae7ff`,size:.06,transparent:!0,opacity:.35,depthWrite:!1,sizeAttenuation:!0}),this.dust=new be(i,this.dustMat),this.scene.add(this.dust),this.buildFarSkyline(),this.scene.add(this.farGroup)}buildFarSkyline(){let e=new h({color:`#0a1018`,roughness:.9,metalness:.1,emissive:`#061018`,emissiveIntensity:.4}),t=new w({color:`#1a4a6a`}),n=new R(1,1,1),r=new R(.2,.3,.02),i=[],a=[],o=new M;for(let e=0;e<36;e+=1){let t=e/36*Math.PI*2+.12,n=32+e%4*2.5,r=8+e*13%14,s=2+e*7%4;o.position.set(Math.cos(t)*n,r/2,Math.sin(t)*n),o.scale.set(s,r,s),o.rotation.set(0,-t,0),o.updateMatrix(),i.push(o.matrix.clone()),e%2==0&&(o.position.set(Math.cos(t)*(n-s*.52),r*.55,Math.sin(t)*(n-s*.52)),o.scale.set(1,1,1),o.lookAt(0,r*.55,0),o.updateMatrix(),a.push(o.matrix.clone()))}let s=new je(n,e,i.length);if(i.forEach((e,t)=>s.setMatrixAt(t,e)),s.instanceMatrix.needsUpdate=!0,s.castShadow=!1,s.frustumCulled=!1,this.farGroup.add(s),a.length){let e=new je(r,t,a.length);a.forEach((t,n)=>e.setMatrixAt(n,t)),e.instanceMatrix.needsUpdate=!0,e.frustumCulled=!1,this.farGroup.add(e)}}triggerPulse(e,t=`#22d3ee`,n=6){let r=new w({color:t,transparent:!0,opacity:.55,side:2,depthWrite:!1}),i=new y(this.pulseGeo,r);i.rotation.x=-Math.PI/2,i.position.set(e.x,.04,e.z),this.scene.add(i),this.pulsePool.push({mesh:i,mat:r,life:.9,maxLife:.9})}update(e,t){let n=this.dust.geometry.getAttribute(`position`);for(let r=0;r<n.count;r+=1){let i=n.getY(r)+e*(.15+r%5*.03),a=n.getX(r)+Math.sin(t*.4+r)*e*.08;i>4&&(i=.2);let o=this.bounds.halfWidth*1.15;a>o&&(a=-o),a<-o&&(a=o),n.setY(r,i),n.setX(r,a)}n.needsUpdate=!0,this.pulseTimer-=e,this.pulseTimer<=0&&(this.pulseTimer=3.5+this.rng()*3,this.triggerPulse(new F((this.rng()-.5)*this.bounds.halfWidth*1.6,0,(this.rng()-.5)*this.bounds.halfDepth*1.6),this.rng()>.5?`#22d3ee`:`#a78bfa`,5));for(let t=this.pulsePool.length-1;t>=0;--t){let n=this.pulsePool[t];n.life-=e;let r=1-Math.max(0,n.life/n.maxLife);n.mesh.scale.setScalar(1+r*10),n.mat.opacity=.55*(1-r),n.life<=0&&(this.scene.remove(n.mesh),n.mat.dispose(),this.pulsePool.splice(t,1))}}reset(){for(let e of this.pulsePool)this.scene.remove(e.mesh),e.mat.dispose();this.pulsePool.length=0,this.pulseTimer=1.5}dispose(){this.reset(),this.scene.remove(this.dust,this.farGroup),this.dust.geometry.dispose(),this.dustMat.dispose(),this.pulseGeo.dispose(),this.farGroup.traverse(e=>{e instanceof y&&e.geometry.dispose()})}},wa=new Map;function Ta(e){return e>=16?3:e>=11?2:+(e>=6)}function Ea(e){let t=[];if(t.push(new xe(.42+e*.04,.95+e*.08,5)),e>=1){let e=new xe(.14,.55,4);e.translate(.28,-.08,0);let n=new xe(.14,.55,4);n.translate(-.28,-.08,0),t.push(e,n)}let n=Ra(t);return n.rotateX(Math.PI/2),n.rotateZ(Math.PI),n.translate(0,.28,.1),za(`chaser`,n,Da(e),Oa(e),ka(e),.48)}function Da(e){let t=new xe(.18+e*.03,.55+e*.1,4);return t.rotateX(-Math.PI/2),t.translate(0,.28,-.55-e*.08),t}function Oa(e){return[`#ef4444`,`#f97316`,`#fb7185`,`#f43f5e`][e]??`#ef4444`}function ka(e){return[`#7f1d1d`,`#9a3412`,`#9f1239`,`#881337`][e]??`#7f1d1d`}function Aa(e){let t=[],n=new H(.38+e*.05,.08+e*.015,6,16);if(t.push(n),e>=1){let n=new H(.52+e*.04,.05,5,14);n.rotateX(.35),n.translate(0,.03,0),t.push(n)}let r=Ra(t);return r.rotateX(Math.PI/2),r.translate(0,.45,0),za(`ranged`,r,ja(e),Ma(e),Na(e),.45)}function ja(e){let t=e>=2?new n(.24+e*.03,0):new re(.22+e*.02,0);return t.translate(0,.55,0),t}function Ma(e){return[`#a78bfa`,`#818cf8`,`#c4b5fd`,`#e879f9`][e]??`#a78bfa`}function Na(e){return[`#4c1d95`,`#312e81`,`#5b21b6`,`#86198f`][e]??`#4c1d95`}function Pa(e){let t=.78+e*.06,n=.5+e*.06,r=.62+e*.05,i=[],a=new R(t,n,r);if(a.translate(0,.55,0),i.push(a),e>=1){let e=new R(.22,.28,.55);e.translate(-t*.55,.55,.05);let n=new R(.22,.28,.55);n.translate(t*.55,.55,.05),i.push(e,n)}if(e>=2){let e=new R(.1,.35,.18);e.translate(-.22,.95,-.2),e.rotateZ(.25);let t=new R(.1,.35,.18);t.translate(.22,.95,-.2),t.rotateZ(-.25),i.push(e,t)}if(e>=3){let e=new R(t*.9,.12,r*.7);e.translate(0,.95,0),i.push(e)}let o=Ra(i),s=new Se(.16+e*.03,8,6);return s.translate(0,.55,-.32),za(`elite`,o,s,Fa(e),Ia(e),.62)}function Fa(e){return[`#f59e0b`,`#fb923c`,`#fbbf24`,`#facc15`][e]??`#f59e0b`}function Ia(e){return[`#92400e`,`#c2410c`,`#b45309`,`#a16207`][e]??`#92400e`}function La(e){let t=new re(.72,0);t.translate(0,1,0);let n=new re(.5,1);return n.translate(0,1,0),za(`boss`,t,n,`#f43f5e`,`#881337`,1.15)}function Ra(e){let t=[],n=[];for(let r of e){let e=r.index?r.toNonIndexed():r,i=e.getAttribute(`position`),a=e.getAttribute(`normal`);for(let e=0;e<i.count;e+=1)t.push(i.getX(e),i.getY(e),i.getZ(e)),a&&n.push(a.getX(e),a.getY(e),a.getZ(e));e!==r&&e.dispose(),r.dispose()}let r=new Ye;return r.setAttribute(`position`,new g(t,3)),n.length===t.length?r.setAttribute(`normal`,new g(n,3)):r.computeVertexNormals(),r}function za(e,t,n,r,i,a){return{shellGeo:t,glowGeo:n,shellMat:new h({color:r,emissive:i,emissiveIntensity:.4,roughness:.4,metalness:.45}),glowMat:new h({color:r,emissive:r,emissiveIntensity:1.2,roughness:.3,metalness:.2}),darkMat:new h({color:`#1a1020`,emissive:i,emissiveIntensity:.12,roughness:.55,metalness:.3}),footGeo:new Ke(a*.92,a,20),footMat:new w({color:r,transparent:!0,opacity:.5,side:2,depthWrite:!1})}}function Ba(e,t=0){let n=`${e}:${t}`,r=wa.get(n);if(r)return r;let i;return i=e===`chaser`?Ea(t):e===`ranged`?Aa(t):e===`elite`?Pa(t):La(t),wa.set(n,i),i}function Va(){for(let e of wa.values())e.shellGeo.dispose(),e.glowGeo.dispose(),e.shellMat.dispose(),e.glowMat.dispose(),e.darkMat.dispose(),e.footGeo.dispose(),e.footMat.dispose();wa.clear()}var Ha={chaser:{kind:`chaser`,hp:28,speed:3.4,radius:.48,contactDamage:9,projectileDamage:0,fireInterval:0,projectileSpeed:0,score:100,color:`#ef4444`,emissive:`#7f1d1d`,scale:1},ranged:{kind:`ranged`,hp:22,speed:2.1,radius:.45,contactDamage:6,projectileDamage:10,fireInterval:1.45,projectileSpeed:11,score:150,color:`#a78bfa`,emissive:`#4c1d95`,scale:1},elite:{kind:`elite`,hp:90,speed:2.8,radius:.62,contactDamage:14,projectileDamage:14,fireInterval:1.1,projectileSpeed:13,score:400,color:`#f59e0b`,emissive:`#92400e`,scale:1.2},boss:{kind:`boss`,hp:720,speed:1.7,radius:1.15,contactDamage:20,projectileDamage:16,fireInterval:.7,projectileSpeed:12,score:2500,color:`#f43f5e`,emissive:`#881337`,scale:1}},Ua=class{stats;seedPhase;group=new I;velocity=new F;radius;phase;hp;maxHp;alive=!0;fireTimer=0;lungeTimer=0;telegraphTimer=0;wantShoot=!1;hitFlashTimer=0;staggerTimer=0;moveSpeedMul=1;fireIntervalMul=1;formTier;bossPhaseColor=null;bossVisual=null;bossRings=[];bossCore=null;chargeScale=1;constructor(e,t,n,r=0){this.stats=e,this.seedPhase=n,this.formTier=r,this.hp=e.hp,this.maxHp=e.hp,this.radius=e.radius*(e.kind===`boss`?1:e.scale),this.phase=n%1,this.group.position.copy(t),this.fireTimer=e.fireInterval*.4+n*.3}hideLegacyVisual(){this.bossVisual&&(this.bossVisual.visible=!1)}ensureBossVisual(e){if(this.bossVisual||this.stats.kind!==`boss`)return;let t=Ba(`boss`),n=new I,r=new y(t.shellGeo,t.shellMat),i=new y(t.glowGeo,t.glowMat);r.castShadow=!0,i.castShadow=!1,n.add(r,i);let a=new y(new H(1.05,.06,6,28),t.shellMat);a.rotation.x=Math.PI/2;let o=new y(new H(.85,.05,6,24),t.glowMat);o.rotation.x=Math.PI/2.4,n.add(a,o),this.bossRings=[a,o],this.bossCore=i;for(let e=0;e<4;e+=1){let r=e/4*Math.PI*2+Math.PI/4,i=new y(new R(.28,.28,.55),t.shellMat);i.position.set(Math.cos(r)*1,.7,Math.sin(r)*1),i.lookAt(0,1.2,0),i.castShadow=!1,n.add(i)}n.position.y=0;let s=1+this.formTier*.12;n.scale.setScalar(s),this.group.add(n),this.bossVisual=n,e.add(this.group)}syncBossVisual(){if(this.bossVisual&&(this.bossVisual.visible=this.alive,this.bossRings[0]&&(this.bossRings[0].rotation.z+=.01),this.bossRings[1]&&(this.bossRings[1].rotation.z-=.014),this.bossCore&&(this.bossCore.rotation.y+=.02),this.bossPhaseColor&&this.bossCore)){let e=this.bossCore.material;e?.emissive&&e.emissive.set(this.bossPhaseColor)}}update(e,t,n,r){if(!this.alive)return;if(this.wantShoot=!1,this.hitFlashTimer=Math.max(0,this.hitFlashTimer-e),this.telegraphTimer=Math.max(0,this.telegraphTimer-e),this.staggerTimer>0){this.staggerTimer=Math.max(0,this.staggerTimer-e),this.velocity.multiplyScalar(Math.exp(-9*e)),this.group.position.addScaledVector(this.velocity,e),this.group.position.x=D.clamp(this.group.position.x,-r.halfWidth+this.radius,r.halfWidth-this.radius),this.group.position.z=D.clamp(this.group.position.z,-r.halfDepth+this.radius,r.halfDepth-this.radius);return}let i=new F(n.x-this.group.position.x,0,n.z-this.group.position.z),a=i.length();a>.001&&i.divideScalar(a);let o=i.clone(),s=this.stats.speed*this.moveSpeedMul;if(this.stats.kind===`ranged`?a<5.3?o.multiplyScalar(-1):Math.abs(a-6.5)<1.2&&(o.set(-i.z,0,i.x),s*=.7):this.stats.kind===`boss`?(a<3.5&&o.multiplyScalar(-.6),o.add(new F(-i.z,0,i.x).multiplyScalar(.35)),o.normalize()):this.stats.kind===`chaser`?(this.lungeTimer=Math.max(0,this.lungeTimer-e),this.lungeTimer<=0&&this.telegraphTimer<=0&&a<4.5&&(this.telegraphTimer=.35),this.telegraphTimer>0&&this.telegraphTimer<.05&&(this.lungeTimer=.35,this.telegraphTimer=0),this.lungeTimer>0&&(s=this.stats.speed*2.4)):this.stats.kind===`elite`&&a<3&&o.multiplyScalar(.4),this.velocity.lerp(o.multiplyScalar(s),1-Math.exp(-6*e)),this.group.position.addScaledVector(this.velocity,e),this.group.position.x=D.clamp(this.group.position.x,-r.halfWidth+this.radius,r.halfWidth-this.radius),this.group.position.z=D.clamp(this.group.position.z,-r.halfDepth+this.radius,r.halfDepth-this.radius),this.group.rotation.y=Math.atan2(i.x,i.z),this.stats.kind===`ranged`||this.stats.kind===`boss`?this.group.position.y=.08+Math.sin(t*3+this.seedPhase*5)*.05:this.group.position.y=Math.abs(Math.sin(t*8+this.seedPhase*3))*.025,this.stats.kind===`ranged`&&(this.chargeScale=.85+D.clamp(1-this.fireTimer/this.stats.fireInterval,0,1)*.55),this.stats.fireInterval>0){let t=Math.max(.08,this.stats.fireInterval*this.fireIntervalMul);this.fireTimer-=e,this.fireTimer<=0&&(this.fireTimer=t,this.wantShoot=!0)}}getChargeScale(){return this.stats.kind===`ranged`?this.chargeScale:1}takeDamage(e){return this.alive?(this.hp-=e,this.hp<=0&&(this.hp=0,this.alive=!1,this.group.visible=!1,!0)):!1}knockback(e,t,n,r=0){if(!this.alive)return;let i=Math.hypot(e,t)||1;this.velocity.set(e/i*n,0,t/i*n),r>0&&(this.staggerTimer=Math.max(this.staggerTimer,r))}hitFlash(){this.hitFlashTimer=.08}dispose(){this.bossVisual&&=(this.group.remove(this.bossVisual),this.bossVisual.traverse(e=>{e instanceof y&&e.geometry.dispose()}),null)}},Wa=[{id:`hunter_pack`,name:`HUNTER PACK`,threat:8,mix:{chaser:6},anchors:[`east`,`west`]},{id:`artillery_nest`,name:`ARTILLERY NEST`,threat:10,mix:{ranged:4},anchors:[`north`,`south`]},{id:`shield_wall`,name:`SHIELD WALL`,threat:12,mix:{elite:2,chaser:4},anchors:[`north`,`south`]},{id:`assassin_strike`,name:`ASSASSIN STRIKE`,threat:11,mix:{elite:2},anchors:[`east`,`west`]},{id:`suppression`,name:`SUPPRESSION`,threat:12,mix:{ranged:3,chaser:5},anchors:[`north`,`south`,`east`]}];function Ga(e,t){return t?0:8+e*3}function Ka(e,t,n){let r=1.2;switch(e){case`north`:return{x:0,z:-n+r};case`south`:return{x:0,z:n-r};case`east`:return{x:t-r,z:0};case`west`:return{x:-t+r,z:0};default:return{x:0,z:0}}}function qa(e,t,n,r,i){let a=t===`ranged`?1.1:.85,o=(n-(r-1)/2)*a,s=()=>(i()-.5)*.35;return e===`assassin_strike`?{offsetX:o*.4+s(),offsetZ:(n===0?1.8:-1.8)+s(),delay:.15+n*.12}:e===`artillery_nest`?{offsetX:o,offsetZ:.6+Math.abs(o)*.15+s(),delay:.1+n*.08}:e===`shield_wall`?{offsetX:o,offsetZ:(t===`elite`?.9:.2)+s(),delay:.05+n*.06}:e===`hunter_pack`?{offsetX:o*.7+s(),offsetZ:.4+n%2*.5,delay:n*.05}:e===`suppression`?{offsetX:o,offsetZ:(t===`ranged`?1.4:.3)+s(),delay:.08+n*.07}:{offsetX:o*.5+s(),offsetZ:s(),delay:n*.04}}function Ja(e){let{wave:t,stressMode:n,rng:r,bossWave:i,halfWidth:a,halfDepth:o}=e;if(n){let e=80+Math.min(280,t*18),n=[];i&&n.push({kind:`boss`,squadId:`boss`,anchor:`center`,offsetX:0,offsetZ:0,delay:0});for(let t=0;t<e+200;t+=1)n.push({kind:`chaser`,squadId:`stress`,anchor:`center`,offsetX:0,offsetZ:0,delay:0});return{tickets:n,squads:[],budgetLeft:0}}let s=Ga(t,!1);i&&(s=Math.max(10,Math.floor(s*.55)));let c=Wa.filter(e=>e.id===`hunter_pack`?t>=1:e.id===`artillery_nest`?t>=2:e.id===`shield_wall`||e.id===`assassin_strike`?t>=4:e.id!==`suppression`||t>=3),l=[],u=[];i&&l.push({kind:`boss`,squadId:`boss`,anchor:`center`,offsetX:0,offsetZ:0,delay:0});let d=0,f=0;for(;s>0&&c.length>0&&d<12;){d+=1;let e=c.filter(e=>e.threat<=s);if(e.length===0)break;let t=e[Math.floor(r()*e.length)];s-=t.threat,u.push(t.id);let n=t.id===`assassin_strike`,i=t.anchors[Math.floor(r()*t.anchors.length)],p=t.anchors.find(e=>e!==i)??i,m=[];for(let[e,n]of Object.entries(t.mix))for(let t=0;t<(n??0);t+=1)m.push(e);m.forEach((e,s)=>{let c=n?s%2==0?i:p:i,u=qa(t.id,e,s,m.length,r),d=Ka(c,a,o);l.push({kind:e,squadId:t.id,anchor:c,offsetX:Ya(d.x+u.offsetX,-a+1,a-1),offsetZ:Ya(d.z+u.offsetZ,-o+1,o-1),delay:f+u.delay})}),f+=.35}let p=i?2+Math.min(8,Math.floor(t*.6)):2+Math.min(14,Math.floor(t*1.1));for(let e=0;e<p;e+=1){let n=r(),i=`chaser`;t>=2&&n<.32?i=`ranged`:t>=4&&n<.48&&(i=`elite`);let s=[`north`,`south`,`east`,`west`][Math.floor(n*4)%4],c=Ka(s,a,o),u=qa(`filler`,i,e,p,r);l.push({kind:i,squadId:`filler`,anchor:s,offsetX:Ya(c.x+u.offsetX,-a+1,a-1),offsetZ:Ya(c.z+u.offsetZ,-o+1,o-1),delay:f+u.delay})}return{tickets:l,squads:u,budgetLeft:s}}function Ya(e,t,n){return Math.max(t,Math.min(n,e))}var Xa=class{scene;bounds;rng;spawnQueue=[];spawnTimer=0;waveClock=0;intermission=0;spawnedThisWave=0;totalThisWave=0;bossRef=null;lastSquads=[];wave=1;stressMode=!1;freezeEnemies=!1;constructor(e,t,n){this.scene=e,this.bounds=t,this.rng=n}reset(){for(let e of this.activeEnemies())this.scene.remove(e.group),e.dispose();this.enemies.length=0,this.wave=1,this.spawnQueue=[],this.spawnTimer=0,this.waveClock=0,this.intermission=this.stressMode?.15:1.2,this.spawnedThisWave=0,this.totalThisWave=0,this.bossRef=null,this.lastSquads=[]}enemies=[];activeEnemies(){return this.enemies.filter(e=>e.alive)}get boss(){return this.bossRef&&this.bossRef.alive?this.bossRef:null}get squads(){return this.lastSquads}getState(){let e=this.enemies.filter(e=>e.alive).length;return{wave:this.wave,alive:e,spawning:this.spawnQueue.length>0||this.intermission>0,intermission:this.intermission,bossActive:!!this.bossRef?.alive,totalToSpawn:this.totalThisWave,spawned:this.spawnedThisWave}}update(e,t,n){for(let e=this.enemies.length-1;e>=0;--e)if(!this.enemies[e].alive){let t=this.enemies[e];this.scene.remove(t.group),t.dispose(),this.enemies.splice(e,1)}if(this.intermission>0&&(this.intermission-=e,this.intermission<=0&&this.beginWave(),this.intermission>0))return;if(this.waveClock+=e,this.spawnQueue.length>0&&(this.spawnTimer-=e,this.spawnTimer<=0)){let e=-1;for(let t=0;t<this.spawnQueue.length;t+=1)if(this.spawnQueue[t].delay<=this.waveClock){e=t;break}if(e>=0){let n=this.spawnQueue.splice(e,1)[0];this.spawnTimer=this.stressMode?.08:.16+this.rng()*.1,this.spawnFromTicket(n,t)}else this.spawnTimer=.05}let r=this.enemies.filter(e=>e.alive).length;this.spawnQueue.length===0&&r===0&&(this.wave+=1,this.intermission=this.stressMode?.6:2.5,this.bossRef=null);for(let r of this.enemies)this.freezeEnemies||r.update(e,n,t,this.bounds)}forceStartWave(e){if(this.intermission=0,this.beginWave(),e&&this.stressMode)for(let t=0;t<48;t+=1)this.spawnEnemyAt(`chaser`,e.x,e.z,!0)}debugClearWave(){for(let e of this.enemies)e.alive&&e.takeDamage(999999);this.spawnQueue=[],this.wave+=1,this.intermission=.08,this.bossRef=null}debugSetWave(e,t){if(this.wave=Math.max(1,e),this.debugClearWave(),this.wave=Math.max(1,e),this.spawnQueue=[],this.intermission=.05,this.beginWave(),t&&this.stressMode)for(let e=0;e<48;e+=1)this.spawnEnemyAt(`chaser`,t.x,t.z,!0)}forceSpawnNear(e,t){let n=this.bounds.halfWidth-1.2,r=this.bounds.halfDepth-1.2,i=this.rng()*Math.PI*2,a=1.6+this.rng()*1.4,o=D.clamp(e.x+Math.cos(i)*a,-n,n),s=D.clamp(e.z+Math.sin(i)*a,-r,r);this.spawnEnemyAt(t,o,s)}spawnFromTicket(e,t){let n=this.bounds.halfWidth-1.2,r=this.bounds.halfDepth-1.2,i=e.offsetX,a=e.offsetZ;if(e.squadId===`stress`||e.anchor===`center`){let e=this.rng()*Math.PI*2,o=5.5+this.rng()*4.5;i=D.clamp(t.x+Math.cos(e)*o,-n,n),a=D.clamp(t.z+Math.sin(e)*o,-r,r)}else{let e=i-t.x,o=a-t.z;e*e+o*o<16&&(i=D.clamp(i+Math.sign(e||1)*6,-n,n),a=D.clamp(a+Math.sign(o||1)*6,-r,r))}this.spawnEnemyAt(e.kind,i,a)}spawnEnemyAt(e,t,n,r=!1){if(r){let e=this.bounds.halfWidth-1.2,r=this.bounds.halfDepth-1.2,i=this.rng()*Math.PI*2,a=5.5+this.rng()*4.5;t=D.clamp(t+Math.cos(i)*a,-e,e),n=D.clamp(n+Math.sin(i)*a,-r,r)}let i=Ha[e],a=Ta(this.wave),o=1+a*.18,s=1+a*.1,c=1+a*.04,l=1+a*.05,u=new Ua({...i,hp:Math.round(i.hp*o),speed:i.speed*c,radius:i.radius*l,contactDamage:Math.round(i.contactDamage*s),projectileDamage:Math.round(i.projectileDamage*s),scale:i.scale*(1+a*.08)},new F(t,0,n),this.rng(),a);u.telegraphTimer=this.stressMode?.2:.55,this.enemies.push(u),this.scene.add(u.group),this.spawnedThisWave+=1,e===`boss`&&(this.bossRef=u)}beginWave(){let e=this.wave,t=e%5==0,{tickets:n,squads:r}=Ja({wave:e,stressMode:this.stressMode,rng:this.rng,bossWave:t,halfWidth:this.bounds.halfWidth,halfDepth:this.bounds.halfDepth});if(this.spawnQueue=n,this.lastSquads=r,this.totalThisWave=n.length,this.spawnedThisWave=0,this.spawnTimer=0,this.waveClock=0,this.stressMode){let e=Math.min(80,this.spawnQueue.length);for(let t=0;t<e;t+=1){let e=this.spawnQueue.shift();e&&this.spawnEnemyAt(e.kind,0,0,!0)}}}},Za=class e{constructor(t,n,r,i,a=`div`){this.parent=t,this.object=n,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add(`lil-controller`),this.domElement.classList.add(i),this.$name=document.createElement(`div`),this.$name.classList.add(`lil-name`),e.nextNameID=e.nextNameID||0,this.$name.id=`lil-gui-name-${++e.nextNameID}`,this.$widget=document.createElement(`div`),this.$widget.classList.add(`lil-widget`),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener(`keydown`,e=>e.stopPropagation()),this.domElement.addEventListener(`keyup`,e=>e.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle(`lil-disabled`,e),this.$disable.toggleAttribute(`disabled`,e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}options(e){let t=this.parent.add(this.object,this.property,e);return t.name(this._name),this.destroy(),t}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);let e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}},Qa=class extends Za{constructor(e,t,n){super(e,t,n,`lil-boolean`,`label`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`checkbox`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener(`change`,()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}};function $a(e){let t,n;return(t=e.match(/(#|0x)?([a-f0-9]{6})/i))?n=t[2]:(t=e.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=e.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),n?`#`+n:!1}var eo={isPrimitive:!0,match:e=>typeof e==`string`,fromHexString:$a,toHexString:$a},to={isPrimitive:!0,match:e=>typeof e==`number`,fromHexString:e=>parseInt(e.substring(1),16),toHexString:e=>`#`+e.toString(16).padStart(6,0)},no=[eo,to,{isPrimitive:!1,match:e=>Array.isArray(e)||ArrayBuffer.isView(e),fromHexString(e,t,n=1){let r=to.fromHexString(e);t[0]=(r>>16&255)/255*n,t[1]=(r>>8&255)/255*n,t[2]=(r&255)/255*n},toHexString([e,t,n],r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return to.toHexString(i)}},{isPrimitive:!1,match:e=>Object(e)===e,fromHexString(e,t,n=1){let r=to.fromHexString(e);t.r=(r>>16&255)/255*n,t.g=(r>>8&255)/255*n,t.b=(r&255)/255*n},toHexString({r:e,g:t,b:n},r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return to.toHexString(i)}}];function ro(e){return no.find(t=>t.match(e))}var io=class extends Za{constructor(e,t,n,r){super(e,t,n,`lil-color`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`color`),this.$input.setAttribute(`tabindex`,-1),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$text=document.createElement(`input`),this.$text.setAttribute(`type`,`text`),this.$text.setAttribute(`spellcheck`,`false`),this.$text.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=ro(this.initialValue),this._rgbScale=r,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener(`input`,()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$text.addEventListener(`input`,()=>{let e=$a(this.$text.value);e&&this._setValueFromHexString(e)}),this.$text.addEventListener(`focus`,()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener(`blur`,()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){let t=this._format.fromHexString(e);this.setValue(t)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}},ao=class extends Za{constructor(e,t,n){super(e,t,n,`lil-function`),this.$button=document.createElement(`button`),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener(`click`,e=>{e.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$disable=this.$button}},oo=class extends Za{constructor(e,t,n,r,i,a){super(e,t,n,`lil-number`),this._initInput(),this.min(r),this.max(i);let o=a!==void 0;this.step(o?a:this._getImplicitStep(),o),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,t=!0){return this._step=e,this._stepExplicit=t,this}updateDisplay(){let e=this.getValue();if(this._hasSlider){let t=(e-this._min)/(this._max-this._min);t=Math.max(0,Math.min(t,1)),this.$fill.style.width=t*100+`%`}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),window.matchMedia(`(pointer: coarse)`).matches&&(this.$input.setAttribute(`type`,`number`),this.$input.setAttribute(`step`,`any`)),this.$widget.appendChild(this.$input),this.$disable=this.$input;let e=()=>{let e=parseFloat(this.$input.value);isNaN(e)||(this._stepExplicit&&(e=this._snap(e)),this.setValue(this._clamp(e)))},t=e=>{let t=parseFloat(this.$input.value);isNaN(t)||(this._snapClampSetValue(t+e),this.$input.value=this.getValue())},n=e=>{e.key===`Enter`&&this.$input.blur(),e.code===`ArrowUp`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e))),e.code===`ArrowDown`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e)*-1))},r=e=>{this._inputFocused&&(e.preventDefault(),t(this._step*this._normalizeMouseWheel(e)))},i=!1,a,o,s,c,l,u=e=>{a=e.clientX,o=s=e.clientY,i=!0,c=this.getValue(),l=0,window.addEventListener(`mousemove`,d),window.addEventListener(`mouseup`,f)},d=e=>{if(i){let t=e.clientX-a,n=e.clientY-o;Math.abs(n)>5?(e.preventDefault(),this.$input.blur(),i=!1,this._setDraggingStyle(!0,`vertical`)):Math.abs(t)>5&&f()}if(!i){let t=e.clientY-s;l-=t*this._step*this._arrowKeyMultiplier(e),c+l>this._max?l=this._max-c:c+l<this._min&&(l=this._min-c),this._snapClampSetValue(c+l)}s=e.clientY},f=()=>{this._setDraggingStyle(!1,`vertical`),this._callOnFinishChange(),window.removeEventListener(`mousemove`,d),window.removeEventListener(`mouseup`,f)};this.$input.addEventListener(`input`,e),this.$input.addEventListener(`keydown`,n),this.$input.addEventListener(`wheel`,r,{passive:!1}),this.$input.addEventListener(`mousedown`,u),this.$input.addEventListener(`focus`,()=>{this._inputFocused=!0}),this.$input.addEventListener(`blur`,()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()})}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement(`div`),this.$slider.classList.add(`lil-slider`),this.$fill=document.createElement(`div`),this.$fill.classList.add(`lil-fill`),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add(`lil-has-slider`);let e=(e,t,n,r,i)=>(e-t)/(n-t)*(i-r)+r,t=t=>{let n=this.$slider.getBoundingClientRect(),r=e(t,n.left,n.right,this._min,this._max);this._snapClampSetValue(r)},n=e=>{this._setDraggingStyle(!0),t(e.clientX),window.addEventListener(`mousemove`,r),window.addEventListener(`mouseup`,i)},r=e=>{t(e.clientX)},i=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`mousemove`,r),window.removeEventListener(`mouseup`,i)},a=!1,o,s,c=e=>{e.preventDefault(),this._setDraggingStyle(!0),t(e.touches[0].clientX),a=!1},l=e=>{e.touches.length>1||(this._hasScrollBar?(o=e.touches[0].clientX,s=e.touches[0].clientY,a=!0):c(e),window.addEventListener(`touchmove`,u,{passive:!1}),window.addEventListener(`touchend`,d))},u=e=>{if(a){let t=e.touches[0].clientX-o,n=e.touches[0].clientY-s;Math.abs(t)>Math.abs(n)?c(e):(window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d))}else e.preventDefault(),t(e.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d)},f=this._callOnFinishChange.bind(this),p;this.$slider.addEventListener(`mousedown`,n),this.$slider.addEventListener(`touchstart`,l,{passive:!1}),this.$slider.addEventListener(`wheel`,e=>{if(Math.abs(e.deltaX)<Math.abs(e.deltaY)&&this._hasScrollBar)return;e.preventDefault();let t=this._normalizeMouseWheel(e)*this._step;this._snapClampSetValue(this.getValue()+t),this.$input.value=this.getValue(),clearTimeout(p),p=setTimeout(f,400)},{passive:!1})}_setDraggingStyle(e,t=`horizontal`){this.$slider&&this.$slider.classList.toggle(`lil-active`,e),document.body.classList.toggle(`lil-dragging`,e),document.body.classList.toggle(`lil-${t}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:t,deltaY:n}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(t=0,n=-e.wheelDelta/120,n*=this._stepExplicit?1:10),t+-n}_arrowKeyMultiplier(e){let t=this._stepExplicit?1:10;return e.shiftKey?t*=10:e.altKey&&(t/=10),t}_snap(e){let t=0;return this._hasMin?t=this._min:this._hasMax&&(t=this._max),e-=t,e=Math.round(e/this._step)*this._step,e+=t,e=parseFloat(e.toPrecision(15)),e}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){let e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}},so=class extends Za{constructor(e,t,n,r){super(e,t,n,`lil-option`),this.$select=document.createElement(`select`),this.$select.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$select.addEventListener(`change`,()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener(`focus`,()=>{this.$display.classList.add(`lil-focus`)}),this.$select.addEventListener(`blur`,()=>{this.$display.classList.remove(`lil-focus`)}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(r)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(e=>{let t=document.createElement(`option`);t.textContent=e,this.$select.appendChild(t)}),this.updateDisplay(),this}updateDisplay(){let e=this.getValue(),t=this._values.indexOf(e);return this.$select.selectedIndex=t,this.$display.textContent=t===-1?e:this._names[t],this}},co=class extends Za{constructor(e,t,n){super(e,t,n,`lil-string`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`spellcheck`,`false`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$input.addEventListener(`input`,()=>{this.setValue(this.$input.value)}),this.$input.addEventListener(`keydown`,e=>{e.code===`Enter`&&this.$input.blur()}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}},lo=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;function uo(e){let t=document.createElement(`style`);t.innerHTML=e;let n=document.querySelector(`head link[rel=stylesheet], head style`);n?document.head.insertBefore(t,n):document.head.appendChild(t)}var fo=!1,po=class e{constructor({parent:e,autoPlace:t=e===void 0,container:n,width:r,title:i=`Controls`,closeFolders:a=!1,injectStyles:o=!0,touchStyles:s=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement(`div`),this.domElement.classList.add(`lil-gui`),this.$title=document.createElement(`button`),this.$title.classList.add(`lil-title`),this.$title.setAttribute(`aria-expanded`,!0),this.$title.addEventListener(`click`,()=>this.openAnimated(this._closed)),this.$title.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$children=document.createElement(`div`),this.$children.classList.add(`lil-children`),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(i),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add(`lil-root`),s&&this.domElement.classList.add(`lil-allow-touch-styles`),!fo&&o&&(uo(lo),fo=!0),n?n.appendChild(this.domElement):t&&(this.domElement.classList.add(`lil-auto-place`,`autoPlace`),document.body.appendChild(this.domElement)),r&&this.domElement.style.setProperty(`--width`,r+`px`),this._closeFolders=a}add(e,t,n,r,i){if(Object(n)===n)return new so(this,e,t,n);let a=e[t];switch(typeof a){case`number`:return new oo(this,e,t,n,r,i);case`boolean`:return new Qa(this,e,t);case`string`:return new co(this,e,t);case`function`:return new ao(this,e,t)}console.error(`gui.add failed
	property:`,t,`
	object:`,e,`
	value:`,a)}addColor(e,t,n=1){return new io(this,e,t,n)}addFolder(t){let n=new e({parent:this,title:t});return this.root._closeFolders&&n.close(),n}load(e,t=!0){return e.controllers&&this.controllers.forEach(t=>{t instanceof ao||t._name in e.controllers&&t.load(e.controllers[t._name])}),t&&e.folders&&this.folders.forEach(t=>{t._title in e.folders&&t.load(e.folders[t._title])}),this}save(e=!0){let t={controllers:{},folders:{}};return this.controllers.forEach(e=>{if(!(e instanceof ao)){if(e._name in t.controllers)throw Error(`Cannot save GUI with duplicate property "${e._name}"`);t.controllers[e._name]=e.save()}}),e&&this.folders.forEach(e=>{if(e._title in t.folders)throw Error(`Cannot save GUI with duplicate folder "${e._title}"`);t.folders[e._title]=e.save()}),t}open(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),this.domElement.classList.toggle(`lil-closed`,this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),requestAnimationFrame(()=>{let t=this.$children.clientHeight;this.$children.style.height=t+`px`,this.domElement.classList.add(`lil-transition`);let n=e=>{e.target===this.$children&&(this.$children.style.height=``,this.domElement.classList.remove(`lil-transition`),this.$children.removeEventListener(`transitionend`,n))};this.$children.addEventListener(`transitionend`,n);let r=e?this.$children.scrollHeight:0;this.domElement.classList.toggle(`lil-closed`,!e),requestAnimationFrame(()=>{this.$children.style.height=r+`px`})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(e=>e.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(t=>{e=e.concat(t.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(t=>{e=e.concat(t.foldersRecursive())}),e}};function mo(){return{godMode:!1,noOverheat:!1,infiniteDash:!1,infiniteUlt:!1,oneShot:!1,enemyPassive:!1,freezeEnemies:!1,autoPickUpgrade:!1,enemyOneHp:!1}}var ho=[{key:`godMode`,label:`无限命 God Mode`},{key:`noOverheat`,label:`永不过热 No Overheat`},{key:`infiniteDash`,label:`无限冲刺 Infinite Dash`},{key:`infiniteUlt`,label:`无限大招 Infinite Ult`},{key:`oneShot`,label:`玩家秒杀 Player One-Shot`},{key:`enemyPassive`,label:`敌人无害 Enemy Passive`},{key:`freezeEnemies`,label:`敌人定身 Freeze Enemies`},{key:`autoPickUpgrade`,label:`自动选升级 Auto Pick`},{key:`enemyOneHp`,label:`敌人一击必杀 Enemy 1HP`}],go=class{tuning;flags;actions;onChange;gui=null;open=!1;trigger;constructor(e,t,n,r){this.tuning=e,this.flags=t,this.actions=n,this.onChange=r,this.trigger=this.ensureTrigger(),this.trigger.addEventListener(`click`,()=>this.toggle()),window.addEventListener(`keydown`,this.onKeyDown),new URLSearchParams(window.location.search).has(`debug`)&&this.setOpen(!0)}ensureTrigger(){let e=document.querySelector(`#debug-trigger`);return e||(e=document.createElement(`button`),e.id=`debug-trigger`,e.type=`button`,e.textContent=`调试`,e.title="打开测试面板（` 或 F2）",e.addEventListener(`click`,e=>e.stopPropagation()),document.querySelector(`#app`)?.appendChild(e),e)}onKeyDown=e=>{(e.code===`Backquote`||e.code===`F2`)&&(e.preventDefault(),this.toggle())};isOpen(){return this.open}toggle(){this.setOpen(!this.open)}setOpen(e){this.open=e,this.trigger.classList.toggle(`active`,e),this.trigger.textContent=e?`关闭调试`:`调试`,e?(this.gui||this.buildGui(),this.gui?.show()):this.gui?.hide()}buildGui(){let e=new po({title:`测试 / Debug Panel`});e.domElement.classList.add(`debug-panel`);let t=e.addFolder(`作弊 Cheats`);for(let{key:e,label:n}of ho)t.add(this.flags,e).name(n);t.open();let n=e.addFolder(`动作 Actions`);n.add(this.actions,`fullHeal`).name(`满血满盾 Full Heal`),n.add(this.actions,`clearHeat`).name(`清空热量 Clear Heat`),n.add(this.actions,`fillUlt`).name(`充能大招 Fill Ult`),n.add(this.actions,`grantAllUpgrades`).name(`拉满升级 Max Upgrades`),n.add(this.actions,`killAllEnemies`).name(`清场 Kill All`),n.add(this.actions,`skipWave`).name(`跳过本波 Skip Wave`),n.add(this.actions,`openUpgrade`).name(`弹出升级 Open Upgrade`),n.add(this.actions,`restart`).name(`重开 Restart`),n.open();let r=e.addFolder(`模式 Modes`),i={stress:!1,low:!1};r.add(i,`stress`).name(`极限压力 Stress`).onChange(e=>this.actions.setStress(e)),r.add(i,`low`).name(`低画质 Low Graphics`).onChange(e=>this.actions.setLowGraphics(e));let a=e.addFolder(`手感 Tuning`);a.add(this.tuning,`speed`,2,14,.1).name(`移速 Speed`),a.add(this.tuning,`dashMultiplier`,1,3,.05).name(`冲刺倍率 Dash ×`),a.add(this.tuning,`acceleration`,4,22,.1).name(`加速度 Accel`),a.add(this.tuning,`cameraLag`,.02,.8,.01).name(`镜头延迟 Cam Lag`),a.add(this.tuning,`maxDpr`,1,2,.25).name(`DPR`).onChange(()=>this.onChange()),a.add(this.tuning,`exposure`,.6,1.8,.01).name(`曝光 Exposure`).onChange(()=>this.onChange()),e.domElement.style.position=`fixed`,e.domElement.style.right=`12px`,e.domElement.style.top=`56px`,e.domElement.style.zIndex=`20`,e.domElement.style.maxHeight=`calc(100vh - 72px)`,e.domElement.style.overflowY=`auto`,this.gui=e,e.hide()}setHidden(e){e&&this.setOpen(!1)}dispose(){window.removeEventListener(`keydown`,this.onKeyDown),this.gui?.destroy(),this.gui=null,this.trigger.remove()}},_o=[`chaser`,`ranged`,`elite`],vo=[0,1,2,3],yo=class{scene;batches=new Map;dummy=new M;color=new z;constructor(e,t=520){this.scene=e;let n=Math.max(160,t);for(let t of _o)for(let r of vo){let i=Ba(t,r),a=new je(i.shellGeo,i.shellMat,n),o=new je(i.glowGeo,i.glowMat,n),s=new je(i.footGeo,i.footMat,n);a.castShadow=!1,a.receiveShadow=!1,o.castShadow=!1,s.castShadow=!1,a.frustumCulled=!1,o.frustumCulled=!1,s.frustumCulled=!1,a.count=0,o.count=0,s.count=0,e.add(a,o,s),this.batches.set(`${t}:${r}`,{shell:a,glow:o,foot:s,count:0})}}sync(e){for(let e of this.batches.values())e.count=0;for(let t of e){if(!t.alive)continue;if(t.stats.kind===`boss`){t.ensureBossVisual(this.scene),t.syncBossVisual();continue}let e=this.batches.get(`${t.stats.kind}:${t.formTier}`);if(!e)continue;let n=e.count;if(n>=e.shell.instanceMatrix.count)continue;let r=t.group.position,i=t.group.rotation.y,a=(t.stats.kind===`elite`?t.stats.scale:1)*(1+t.formTier*.04);this.dummy.position.set(r.x,r.y,r.z),this.dummy.rotation.set(0,i,0),this.dummy.scale.setScalar(a),this.dummy.updateMatrix(),e.shell.setMatrixAt(n,this.dummy.matrix),e.glow.setMatrixAt(n,this.dummy.matrix),this.dummy.position.set(r.x,.02,r.z),this.dummy.rotation.set(-Math.PI/2,0,0),this.dummy.scale.setScalar(1+t.formTier*.06),this.dummy.updateMatrix(),e.foot.setMatrixAt(n,this.dummy.matrix);let o=t.telegraphTimer>0?1.15:.55+t.formTier*.12;this.color.setRGB(o,o*(t.telegraphTimer>0?.35:.6),o*.35),e.foot.setColorAt(n,this.color),e.count+=1,t.hideLegacyVisual()}for(let e of this.batches.values())e.shell.count=e.count,e.glow.count=e.count,e.foot.count=e.count,e.shell.instanceMatrix.needsUpdate=!0,e.glow.instanceMatrix.needsUpdate=!0,e.foot.instanceMatrix.needsUpdate=!0,e.foot.instanceColor&&(e.foot.instanceColor.needsUpdate=!0),e.shell.visible=e.count>0,e.glow.visible=e.count>0,e.foot.visible=e.count>0}dispose(){for(let e of this.batches.values())this.scene.remove(e.shell,e.glow,e.foot),e.shell.dispose(),e.glow.dispose(),e.foot.dispose();this.batches.clear()}},bo=[{id:`overclock`,color:`#22d3ee`,maxStacks:4,apply:({build:e})=>{e.global.fireMul*=.9}},{id:`thrusters`,color:`#7ae7ff`,maxStacks:4,apply:({stats:e})=>{e.moveSpeed+=.45}},{id:`armor`,color:`#ff4d6d`,maxStacks:5,apply:({stats:e})=>{e.maxHp+=20}},{id:`shield_bank`,color:`#3ec6ff`,maxStacks:4,apply:({stats:e})=>{e.maxShield+=15}},{id:`coolant_loop`,color:`#4ade80`,maxStacks:4,apply:({stats:e})=>{e.heatCoolPerSec+=7,e.overheatLockPerSec+=3}},{id:`capacitor`,color:`#a78bfa`,maxStacks:3,apply:({stats:e})=>{e.maxHeat+=12}},{id:`dash_servos`,color:`#22d3ee`,maxStacks:4,apply:({stats:e})=>{e.dashCooldown=Math.max(.45,e.dashCooldown*.88)}},{id:`mag_accel`,color:`#94a3b8`,maxStacks:4,apply:({build:e})=>{e.global.speedMul*=1.08}},{id:`arc_capacitor`,color:`#38bdf8`,maxStacks:2,weaponAffinity:`plasma`,apply:({mods:e})=>{e.arcChain+=1}},{id:`overheat_cascade`,color:`#f97316`,maxStacks:1,weaponAffinity:`plasma`,apply:({mods:e})=>{e.overheatEmp=!0}},{id:`critical_conductor`,color:`#e879f9`,maxStacks:1,weaponAffinity:`plasma`,apply:({mods:e})=>{e.critConductor=!0}},{id:`rail_bore`,color:`#fbbf24`,maxStacks:2,weaponAffinity:`rail`,apply:({build:e})=>{e.modifiers.railPierce+=1,e.perWeapon.rail.dmgBonus+=2}},{id:`rail_reactor`,color:`#f59e0b`,maxStacks:1,weaponAffinity:`rail`,apply:({mods:e})=>{e.railHeatRefund=!0}},{id:`scatter_choke`,color:`#f472b6`,maxStacks:2,weaponAffinity:`scatter`,apply:({build:e})=>{e.modifiers.scatterCloseBonus=!0,e.perWeapon.scatter.dmgBonus+=1,e.perWeapon.scatter.spreadMul*=.72}},{id:`dash_detonation`,color:`#22d3ee`,maxStacks:1,weaponAffinity:`scatter`,apply:({mods:e})=>{e.dashDetonation=!0}},{id:`shield_nova`,color:`#3ec6ff`,maxStacks:1,apply:({mods:e})=>{e.shieldNova=!0}}];function xo(e,t,n,r=3){let i=bo.filter(t=>(e[t.id]??0)<t.maxStacks).slice(),a=[];for(;a.length<r&&i.length>0;){let r=0,o=i.map(t=>{let i=1/(1+(e[t.id]??0)*.85);return n&&t.weaponAffinity===n&&(i*=1.6),r+=i,i}),s=t()*r,c=0;for(let e=0;e<i.length;e+=1)if(s-=o[e],s<=0){c=e;break}let[l]=i.splice(c,1),u=ta(l.id);a.push({id:l.id,name:u.name,desc:u.desc,color:l.color})}return a}function So(e){return bo.find(t=>t.id===e)}function Co(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var wo=[`plasma`,`rail`,`scatter`],To={plasma:{id:`plasma`,name:`Plasma Repeater`,short:`PLS`,color:`#22d3ee`,fireInterval:.11,heatPerShot:4.2,damage:12,projectileSpeed:28,pellets:1,spread:0,pierce:0,desc:`Sustained fire · heat pressure`},rail:{id:`rail`,name:`Railgun`,short:`RAIL`,color:`#fbbf24`,fireInterval:.42,heatPerShot:11,damage:34,projectileSpeed:42,pellets:1,spread:0,pierce:2,desc:`Heavy slug · pierces lines`},scatter:{id:`scatter`,name:`Scattergun`,short:`SCT`,color:`#f472b6`,fireInterval:.38,heatPerShot:9,damage:7,projectileSpeed:24,pellets:5,spread:.22,pierce:0,desc:`Close burst · multi-pellet`}};function Eo(e){return wo[(e%wo.length+wo.length)%wo.length]}var Do={arcChain:0,overheatEmp:!1,critConductor:!1,railPierce:0,railHeatRefund:!1,scatterCloseBonus:!1,dashDetonation:!1,shieldNova:!1};function Oo(){return{...Do}}function ko(e){Object.assign(e,Do)}function Ao(e){let t=[];return e.arcChain>0&&t.push(`arc_capacitor×${e.arcChain}`),e.overheatEmp&&t.push(`overheat_cascade`),e.critConductor&&t.push(`critical_conductor`),e.railPierce>0&&t.push(`rail_bore×${e.railPierce}`),e.railHeatRefund&&t.push(`rail_reactor`),e.scatterCloseBonus&&t.push(`scatter_choke`),e.dashDetonation&&t.push(`dash_detonation`),e.shieldNova&&t.push(`shield_nova`),t}var jo=1.5,Mo=5.5,No=3.2,Po=4.5;function Fo(){return{fireMul:1,speedMul:1,dmgBonus:0,extraPierce:0,spreadMul:1}}function Io(){return{fireMul:1,speedMul:1}}function Lo(e){return{weapon:`plasma`,global:Io(),perWeapon:{plasma:Fo(),rail:Fo(),scatter:Fo()},modifiers:e}}function Ro(e,t){e.weapon=`plasma`,e.global=Io(),e.perWeapon={plasma:Fo(),rail:Fo(),scatter:Fo()},e.modifiers=t}function zo(e,t){let n=To[t],r=e.global,i=e.perWeapon[t],a=e.modifiers,o=t===`rail`?a.railPierce+i.extraPierce:i.extraPierce;return{def:n,fireInterval:Math.max(.05,n.fireInterval*r.fireMul*i.fireMul),heatPerShot:n.heatPerShot,damage:Math.max(1,n.damage+i.dmgBonus),projectileSpeed:n.projectileSpeed*r.speedMul*i.speedMul,pierce:n.pierce+o,spread:n.spread*i.spreadMul,pellets:n.pellets,color:n.color}}var Bo=class{deps;dashBlasts=[];chainDepth=0;tmpDir=new F;tmpUp=new F(0,1,0);constructor(e){this.deps=e}reset(){this.dashBlasts.length=0,this.chainDepth=0}queueDashBlast(e){this.deps.combatMods.dashDetonation&&(this.dashBlasts.push({pos:e.clone().setY(.2),timer:.28}),this.deps.vfx.spawnBurst(e.clone().setY(.2),`#f472b6`,6,3.5))}firePlayerWeapon(){let{player:e,projectiles:t,vfx:n,audio:r,feel:i,getBuild:a,getWeapon:o}=this.deps,s=zo(a(),o());r.shoot(),this.tmpDir.set(e.aim.x,0,e.aim.y);for(let n=0;n<s.pellets;n+=1){let r=(s.pellets===1?0:n/(s.pellets-1)-.5)*s.spread*2,i=this.tmpDir.clone().applyAxisAngle(this.tmpUp,r);t.spawn(e.muzzle,i,s.projectileSpeed,s.damage,`player`,s.color,{pierce:s.pierce,sourceWeapon:s.def.id})}this.deps.onShot?.(s.pellets,s.def.id);let c=s.def.id,l=c===`scatter`?8:c===`rail`?6:3,u=c===`rail`?6.5:c===`scatter`?4.2:3.5;n.spawnBurst(e.muzzle,s.color,l,u),n.spawnBurst(e.muzzle.clone().add(new F(-e.aim.y,.1,e.aim.x).multiplyScalar(.2)),s.color,c===`rail`?3:1,2.2),i.triggerFovPunch(s.def.id===`rail`?2.2:1.1)}resolveProjectileHits(e,t){let{player:n,projectiles:r,waves:i,vfx:a,audio:o,decals:s,feel:c,combatMods:l,onEnemyKilled:u}=this.deps;for(let d of r.projectiles){if(!d.active)continue;let r=d.group.position;if(Math.abs(r.x)>e.halfWidth+2||Math.abs(r.z)>e.halfDepth+2){d.deactivate();continue}let f=!1;for(let e of t)if(e.blocksPoint(r)){e.takeDamage(d.damage*.5),a.spawnBurst(r,`#94a3b8`,4,3),d.deactivate(),f=!0;break}if(!f){if(d.owner===`player`)for(let e of i.enemies){if(!e.alive||d.hitSet.has(e.group.uuid))continue;let t=r.x-e.group.position.x,i=r.z-e.group.position.z,f=e.radius+d.radius;if(t*t+i*i<=f*f){d.hitSet.add(e.group.uuid),e.hitFlash();let t=d.damage,i=this.deps.getPlayerDamageMul?.()??1;i!==1&&(t*=i),this.deps.getEnemyOneHp?.()&&(t=Math.max(t,999999)),l.scatterCloseBonus&&d.sourceWeapon===`scatter`&&r.distanceTo(n.group.position)<3.5&&(t*=1.35),l.railPierce>0&&d.sourceWeapon===`rail`&&(t*=1+d.hitsLanded*.08),d.hitsLanded+=1;let f=e.takeDamage(t);this.deps.onDamageDealt?.(t,d.sourceWeapon),o.hit(),a.spawnBurst(r,d.crit?`#fbbf24`:e.stats.color,d.crit?10:6,5),f||s.spawnImpact(r,e.stats.color),f?u(e,d):c.triggerHitstop(.03),d.pierce>0?--d.pierce:d.deactivate();break}}else if(this.deps.getEnemyPassive?.()){let e=r.x-n.group.position.x,t=r.z-n.group.position.z,i=.55+d.radius;e*e+t*t<=i*i&&d.deactivate()}else{let e=r.x-n.group.position.x,t=r.z-n.group.position.z,i=.55+d.radius;if(e*e+t*t<=i*i){let e=n.takeDamage(d.damage);e.hit&&(this.deps.onPlayerProjectileHit(),e.shieldBroke&&this.maybeShieldNova()),d.deactivate()}}}}}castOverheatEmp(){let{player:e,waves:t,vfx:n,audio:r,hud:i,feel:a,worldFx:o,onEnemyKilled:s}=this.deps;r.overheat(),i.pushKillFeed(Q().overheatEmp,`boss`),i.showWaveBanner(Q().empCascade,!0),n.spawnShockwave(e.group.position,`#f97316`,Mo*.7),o.triggerPulse(e.group.position,`#f97316`,Mo),a.triggerHitstop(.1),a.triggerFovPunch(4);let c=e.group.position;for(let e of t.enemies){if(!e.alive)continue;let t=e.group.position.x-c.x,r=e.group.position.z-c.z;if(t*t+r*r<=30.25){e.staggerTimer=Math.max(e.staggerTimer,.55);let t=e.takeDamage(28);n.spawnBurst(e.group.position.clone().setY(.4),`#f97316`,8,5),t&&s(e)}}}spawnArcChains(e,t){if(this.chainDepth>=4)return;let{waves:n,vfx:r,audio:i,combatMods:a,rng:o,onEnemyKilled:s}=this.deps;this.chainDepth+=1;try{let c=n.enemies.filter(e=>e.alive).map(t=>({e:t,d:(t.group.position.x-e.x)*(t.group.position.x-e.x)+(t.group.position.z-e.z)*(t.group.position.z-e.z)})).filter(e=>e.d>.01&&e.d<=17.64).sort((e,t)=>e.d-t.d).slice(0,t);for(let{e}of c){let t=10,n=a.critConductor&&o()<.35;n&&(t*=jo),r.spawnBurst(e.group.position.clone().setY(.5),n?`#fbbf24`:`#38bdf8`,7,4.5);let c=e.takeDamage(t);i.hit(),c?s(e):e.staggerTimer=Math.max(e.staggerTimer,.12)}}finally{--this.chainDepth}}maybeShieldNova(){if(!this.deps.combatMods.shieldNova)return;let{player:e,waves:t,vfx:n,hud:r,onEnemyKilled:i}=this.deps;r.pushKillFeed(Q().shieldNova,`ranged`),n.spawnShockwave(e.group.position,`#3ec6ff`,Po*.75);let a=e.group.position;for(let e of t.enemies){if(!e.alive)continue;let t=e.group.position.x-a.x,n=e.group.position.z-a.z,r=t*t+n*n;if(r>20.25)continue;let o=Math.max(Math.sqrt(r),1e-4);e.knockback(t/o,n/o,14,.2),e.takeDamage(16)&&i(e)}}tickDashBlasts(e){let{waves:t,vfx:n,worldFx:r,feel:i,onEnemyKilled:a}=this.deps;for(let o=this.dashBlasts.length-1;o>=0;--o){let s=this.dashBlasts[o];if(s.timer-=e,!(s.timer>0)){n.spawnShockwave(s.pos,`#f472b6`,No*.8),r.triggerPulse(s.pos,`#f472b6`,No),i.triggerFovPunch(2);for(let e of t.enemies){if(!e.alive)continue;let t=e.group.position.x-s.pos.x,r=e.group.position.z-s.pos.z;if(t*t+r*r>3.2*3.2)continue;let i=e.takeDamage(22);n.spawnBurst(e.group.position.clone().setY(.4),`#f472b6`,6,4),i&&a(e)}this.dashBlasts.splice(o,1)}}}},Vo=[{id:1,name:`SWEEP`,maxHpRatio:.7,moveSpeedMul:1,fireIntervalMul:1,projectileDamageMul:1,fanCount:3,fanSpread:.28,summonEvery:6,summonCount:2,ringEvery:0,color:`#f43f5e`},{id:2,name:`LOCKDOWN`,maxHpRatio:.4,moveSpeedMul:1.12,fireIntervalMul:.78,projectileDamageMul:1.15,fanCount:5,fanSpread:.2,summonEvery:5,summonCount:3,ringEvery:3.1,color:`#fb7185`},{id:3,name:`OVERDRIVE`,maxHpRatio:0,moveSpeedMul:1.28,fireIntervalMul:.58,projectileDamageMul:1.3,fanCount:7,fanSpread:.16,summonEvery:4,summonCount:3,ringEvery:2.2,color:`#fda4af`}];function Ho(){return{phase:1,summonTimer:Vo[0].summonEvery*.55,ringTimer:2.4,spiralAngle:0}}function Uo(e){return e<=.4?3:e<=.7?2:1}function Wo(e){return Vo.find(t=>t.id===e)??Vo[0]}function Go(e,t){let n=Uo(t);if(n===e.phase)return{changed:!1,phase:Wo(e.phase)};e.phase=n;let r=Wo(n);return e.summonTimer=r.summonEvery*.4,e.ringTimer=1.4,{changed:!0,phase:r}}function Ko(e){return{...e,complete:e.mode===`dead`}}var $={halfWidth:14,halfDepth:9},qo=.55,Jo={chaser:12,ranged:10,elite:7,boss:2.8},Yo=.24,Xo=2.4,Zo=48,Qo=class{canvas;backend;renderer;scene=new G;camera=new Je(Zo,1,.1,140);input;player=new Li({...Ii});pickups=[];covers=[];projectiles;waves;audio=new Vi;hud=new oa;cameraRig=new Hi(this.camera);vfx;worldFx;decals;feel;hemiLight=null;fillLight=null;enemyBatch;postFx=null;loop=new bi((e,t)=>this.update(e,t),()=>this.render());tuning={speed:Ii.moveSpeed,dashMultiplier:1,acceleration:14,cameraLag:.12,exposure:1.34,maxDpr:2};debugTools;debugFlags=mo();inputFrame={move:new _,aim:new _,fireHeld:!1,dashPressed:!1,ultPressed:!1,pausePressed:!1,restartPressed:!1,upgradeChoice:-1,weaponChoice:-1};tmp={aim:new _,dir:new F,shake:new F,hitPoint:new F};frame=0;score=0;elapsed=0;combo=1;peakCombo=1;comboTimer=0;mode=`play`;rngSeed=1;rng=Co(1);pausedForScreenshot=!1;reducedMotion=!1;lastWaveShown=0;lastEnemyFormTier=0;fpsAccum=0;fpsFrames=0;weapon=`plasma`;combatMods=Oo();combatBuild=Lo(this.combatMods);combat;bossRuntime=Ho();lastBossRef=null;fps=60;stressMode=!1;lowGraphics=!1;kills=0;combatTime=0;damageDealt=0;shotsFired=0;hitsLanded=0;damageByWeapon={};shotsByWeapon={};frameTimes=[];lastDeathCause=`unknown`;pickupChain=0;pickupChainTimer=0;crosshairEl=null;ndc=new _;upgradeStacks={};upgradeOffers=[];constructor(e,t){this.canvas=e,this.backend=t??Oi(e),this.renderer=this.backend.renderer,this.renderer.toneMappingExposure=this.tuning.exposure,this.feel=new Ui(Zo,this.camera),this.postFx=this.backend.kind===`webgl2`?new xa(this.backend.renderer,this.scene,this.camera):null,this.crosshairEl=document.querySelector(`#crosshair`),this.vfx=new Sa(this.scene,()=>this.rng(),4e3),this.worldFx=new Ca(this.scene,()=>this.rng(),$),this.decals=new Wi(this.scene,48),this.enemyBatch=new yo(this.scene,520),this.projectiles=new Bi(this.scene,2500),this.waves=new Xa(this.scene,$,()=>this.rng()),this.combat=new Bo({player:this.player,projectiles:this.projectiles,waves:this.waves,vfx:this.vfx,audio:this.audio,hud:this.hud,feel:this.feel,worldFx:this.worldFx,decals:this.decals,combatMods:this.combatMods,getBuild:()=>this.combatBuild,getWeapon:()=>this.weapon,rng:()=>this.rng(),onEnemyKilled:(e,t)=>this.onEnemyKilled(e,t),onPlayerProjectileHit:()=>{this.lastDeathCause=`projectile`,this.onPlayerHurt()},onDamageDealt:(e,t)=>this.recordDamage(e,t),onShot:(e,t)=>this.recordShots(e,t),getPlayerDamageMul:()=>this.debugFlags.oneShot?20:1,getEnemyOneHp:()=>this.debugFlags.enemyOneHp,getEnemyPassive:()=>this.debugFlags.enemyPassive});let n=this.getElement(`#touch-stick`),r=this.getElement(`#touch-knob`),i=this.getElement(`#dash-button`),a=this.getElement(`#ult-button`);this.input=new yi(e,n,r,i,a,this.camera),this.debugTools=new go(this.tuning,this.debugFlags,{fullHeal:()=>{this.player.hp=this.player.stats.maxHp,this.player.shield=this.player.stats.maxShield,this.player.alive=!0,this.player.group.visible=!0,this.mode===`dead`&&(this.mode=`play`)},clearHeat:()=>{this.player.heat=0,this.player.overheated=!1},fillUlt:()=>{this.player.ultCharge=100},grantAllUpgrades:()=>{for(let e of bo){let t=this.upgradeStacks[e.id]??0,n=e.maxStacks-t;for(let t=0;t<n;t+=1)e.apply({stats:this.player.stats,build:this.combatBuild,mods:this.combatMods}),this.upgradeStacks[e.id]=(this.upgradeStacks[e.id]??0)+1}this.syncWeaponStats(),this.player.overheatEmp=this.combatMods.overheatEmp,this.player.hp=this.player.stats.maxHp,this.player.shield=this.player.stats.maxShield,this.refreshPlayerForm()},killAllEnemies:()=>{for(let e of[...this.waves.enemies])e.alive&&(e.takeDamage(999999),this.onEnemyKilled(e))},skipWave:()=>{for(let e of[...this.waves.enemies])e.alive&&(e.takeDamage(999999),this.onEnemyKilled(e));this.waves.debugClearWave()},openUpgrade:()=>{this.lastWaveShown=Math.max(0,this.waves.wave-1),this.mode=`play`,this.openUpgrade()},restart:()=>this.restart(),setStress:e=>this.setStressMode(e),setLowGraphics:e=>{this.setLowGraphics(e);let t=document.querySelector(`#gfx-toggle`);t&&(t.checked=e)}},()=>{this.renderer.toneMappingExposure=this.tuning.exposure,this.syncPostSize()}),this.hud.setOverlayHandlers(()=>this.handlePrimaryAction(),()=>this.restart()),this.hud.setStressHandler(e=>this.setStressMode(e)),this.hud.setGraphicsHandler(e=>this.setLowGraphics(e)),this.hud.setUpgradePickHandler(e=>this.applyUpgrade(e)),this.hud.setLocaleToggleHandler(()=>$i()),this.hud.setWeaponPickHandler(e=>{this.mode===`play`&&this.setWeapon(Eo(e))}),this.createScene(),this.installTestHooks(),this.restart(),this.publishDiagnostics()}start(){ki(this.backend).catch(()=>{}),this.loop.start()}dispose(){this.loop.stop(),this.input.dispose(),this.audio.dispose(),this.debugTools.dispose(),this.projectiles.dispose(),this.waves.reset();for(let e of this.pickups)e.dispose();for(let e of this.covers)e.dispose();this.player.dispose(),this.vfx.dispose(),this.worldFx.dispose(),this.decals.dispose(),this.enemyBatch.dispose(),Va(),this.postFx?.dispose(),this.renderer.dispose(),window.__THREE_GAME_DIAGNOSTICS__=void 0,window.__THREE_GAME_TEST_HOOKS__=void 0}update(e,t){if(this.frame+=1,this.frameTimes.push(e),this.frameTimes.length>240&&this.frameTimes.shift(),this.fpsAccum+=e,this.fpsFrames+=1,this.fpsAccum>=.4&&(this.fps=this.fpsFrames/this.fpsAccum,this.fpsAccum=0,this.fpsFrames=0),this.pausedForScreenshot){this.publishDiagnostics();return}this.syncPostSize();let n=this.reducedMotion?0:e,r=this.reducedMotion?0:t;if(this.player.stats.moveSpeed=this.tuning.speed,this.player.dashSpeedMul=this.tuning.dashMultiplier,this.player.moveAccel=this.tuning.acceleration,this.debugFlags.godMode&&this.reviveGodMode(),this.input.read(this.inputFrame),this.inputFrame.restartPressed){this.restart();return}this.mode===`upgrade`?this.debugFlags.autoPickUpgrade&&this.upgradeOffers.length>0?(this.applyUpgrade(0),this.inputFrame.weaponChoice=-1):this.inputFrame.upgradeChoice>=0?(this.applyUpgrade(this.inputFrame.upgradeChoice),this.inputFrame.weaponChoice=-1):this.inputFrame.pausePressed&&(this.upgradeOffers=[],this.hud.hideUpgradeCards(),this.mode=`play`):this.mode===`play`&&this.inputFrame.weaponChoice>=0?this.setWeapon(Eo(this.inputFrame.weaponChoice)):this.inputFrame.pausePressed&&this.mode!==`dead`&&(this.mode=this.mode===`paused`?`play`:`paused`);let i=this.mode===`play`?this.feel.consumeWorldDelta(e):0;if(this.mode===`play`&&i>0&&(this.elapsed+=i,this.simulate(i,r)),this.input.computeAim(this.player.group.position,this.tmp.aim),this.mode===`play`){let n=this.vfx.getShakeOffset(t,this.tmp.shake);this.cameraRig.update(e,this.player.group.position,this.tuning.cameraLag,n)}else this.cameraRig.update(e,this.player.group.position,this.tuning.cameraLag,this.tmp.shake.set(0,0,0));this.feel.update(e),this.vfx.update(n),this.worldFx.update(n,t),this.decals.update(n),this.applyWaveLighting(n),this.updateCrosshair(),this.applyHurtFlash(),this.pushHud(e),this.publishDiagnostics()}simulate(e,t){this.combatTime+=e,this.input.computeAim(this.player.group.position,this.tmp.aim),this.player.overheatEmp=this.combatMods.overheatEmp;let n=this.inputFrame.dashPressed,r=this.player.overheated,i=this.player.dashTimer,a=this.player.update(e,t,this.inputFrame.move,this.tmp.aim,this.inputFrame.fireHeld,n,$),o=this.player.dashTimer>0&&i<=0;this.debugFlags.godMode&&this.reviveGodMode(),this.debugFlags.noOverheat&&(this.player.heat=0,this.player.overheated=!1,this.player.overheatPulse=!1),this.debugFlags.infiniteDash&&(this.player.dashCooldown=0),this.debugFlags.infiniteUlt&&(this.player.ultCharge=100),n&&this.player.dashCooldown>Ii.dashCooldown-.05&&(this.audio.dash(),this.vfx.spawnBurst(this.player.group.position.clone().setY(.4),`#22d3ee`,8,4),this.feel.triggerFovPunch(2)),o&&this.combatMods.dashDetonation&&this.combat.queueDashBlast(this.player.group.position),this.player.overheatPulse?this.combat.castOverheatEmp():this.player.overheated&&!r&&this.audio.overheat(),a.fired&&this.combat.firePlayerWeapon(),this.combat.tickDashBlasts(e),this.player.getHeatRatio()>.45&&this.rng()<.35&&this.vfx.spawnBurst(this.player.group.position.clone().setY(.7),this.player.overheated?`#ffb020`:`#94a3b8`,1,1.8),this.inputFrame.ultPressed&&this.player.tryUltimate()&&this.castUltimate();for(let e of this.covers)e.resolveEntity(this.player.group.position,.55);this.waves.freezeEnemies=this.debugFlags.freezeEnemies,this.waves.update(e,this.player.group.position,t),this.enemyBatch.sync(this.waves.enemies);let s=this.waves.getState();if(s.wave!==this.lastWaveShown){let e=this.lastWaveShown;this.lastWaveShown=s.wave;let t=s.wave%5==0;this.hud.showWaveBanner(t?Q().bossBanner(s.wave):Q().waveBanner(s.wave),t),t?this.audio.boss():this.audio.wave();let n=Ta(s.wave);if(n>this.lastEnemyFormTier&&(this.lastEnemyFormTier=n,this.hud.pushKillFeed(Q().hostilesEvolved(n),`boss`),window.setTimeout(()=>{this.hud.showWaveBanner(Q().hostilesEvolved(n),!0)},900)),e>0&&(this.feel.triggerSlowmo(.45,.4),this.feel.triggerFovPunch(3),this.worldFx.triggerPulse(this.player.group.position,`#22d3ee`,8),this.vfx.spawnShockwave(this.player.group.position,`#7ae7ff`,5)),!this.stressMode&&e>=1){this.openUpgrade();return}}this.separateEnemies();for(let e of this.waves.enemies){if(!e.alive)continue;let t=e.group.position.x-this.player.group.position.x,n=e.group.position.z-this.player.group.position.z,r=e.radius+qo,i=t*t+n*n;if(i<r*r&&!this.debugFlags.enemyPassive){let a=this.player.takeDamage(e.stats.contactDamage);if(a.hit){this.lastDeathCause=e.stats.kind,this.onPlayerHurt(),a.shieldBroke&&this.combat.maybeShieldNova();let r=Math.max(Math.sqrt(i),1e-4),o=Jo[e.stats.kind]??8;e.knockback(t/r,n/r,o,Yo),this.vfx.spawnBurst(new F((e.group.position.x+this.player.group.position.x)*.5,.45,(e.group.position.z+this.player.group.position.z)*.5),`#ff8fa3`,5,4)}if(i>1e-6){let a=Math.sqrt(i),o=(r-a)/a;e.group.position.x+=t*o,e.group.position.z+=n*o}else{let t=e.phase*Math.PI*2;e.group.position.x=this.player.group.position.x+Math.cos(t)*r,e.group.position.z=this.player.group.position.z+Math.sin(t)*r}}for(let t of this.covers)t.resolveEntity(e.group.position,e.radius);if(e.wantShoot&&e.stats.fireInterval>0&&!this.debugFlags.enemyPassive){let t=e.group.position.clone().setY(.55),n=new F(this.player.group.position.x-t.x,0,this.player.group.position.z-t.z).normalize();if(e.stats.kind===`boss`){this.updateBossPhase(e);let r=Wo(this.bossRuntime.phase),i=r.fanCount,a=(i-1)/2*r.fanSpread;for(let o=0;o<i;o+=1){let i=-a+o*r.fanSpread,s=n.clone().applyAxisAngle(new F(0,1,0),i);this.projectiles.spawn(t,s,e.stats.projectileSpeed*(r.id===3?1.12:1),e.stats.projectileDamage*r.projectileDamageMul,`enemy`,r.color)}}else this.projectiles.spawn(t,n,e.stats.projectileSpeed,e.stats.projectileDamage,`enemy`,`#c4b5fd`)}}this.tickBossLogic(e),this.projectiles.update(e),this.combat.resolveProjectileHits($,this.covers),this.comboTimer>0&&(this.comboTimer-=e,this.comboTimer<=0&&(this.combo=1)),this.pickupChainTimer>0&&(this.pickupChainTimer-=e,this.pickupChainTimer<=0&&(this.pickupChain=0));for(let n of this.pickups){if(n.update(e,t,this.player.group.position),!n.active)continue;let r=n.group.position.x-this.player.group.position.x,i=n.group.position.z-this.player.group.position.z;r*r+i*i<.7*.7&&this.collectPickup(n)}}separateEnemies(){let e=this.waves.enemies,t=0;for(let n of e)n.alive&&(t+=1);if(t<2)return;let n=Xo,r=new Map,i=[];for(let t=0;t<e.length;t+=1){if(!e[t].alive)continue;i.push(t);let a=e[t].group.position,o=this.hashCell(Math.floor(a.x/n),Math.floor(a.z/n)),s=r.get(o);s||(s=[],r.set(o,s)),s.push(t)}for(let t=0;t<i.length;t+=1){let a=i[t],o=e[a],s=Math.floor(o.group.position.x/n),c=Math.floor(o.group.position.z/n);for(let t=-1;t<=1;t+=1)for(let n=-1;n<=1;n+=1){let i=r.get(this.hashCell(s+t,c+n));if(i)for(let t of i){if(t<=a)continue;let n=e[t];if(!n.alive)continue;let r=o.radius+n.radius,i=n.group.position.x-o.group.position.x,s=n.group.position.z-o.group.position.z,c=i*i+s*s;if(c>=r*r)continue;if(c<1e-8){let e=(o.phase+n.phase)*Math.PI,t=r*.5,i=o.group.position.x,a=o.group.position.z;o.group.position.x=i-Math.cos(e)*t,o.group.position.z=a-Math.sin(e)*t,n.group.position.x=i+Math.cos(e)*t,n.group.position.z=a+Math.sin(e)*t;continue}let l=Math.sqrt(c),u=(r-l)/l*.5;o.group.position.x-=i*u,o.group.position.z-=s*u,n.group.position.x+=i*u,n.group.position.z+=s*u}}o.group.position.x=D.clamp(o.group.position.x,-$.halfWidth+o.radius,$.halfWidth-o.radius),o.group.position.z=D.clamp(o.group.position.z,-$.halfDepth+o.radius,$.halfDepth-o.radius)}}hashCell(e,t){return(e+512)*1024+(t+512)}onEnemyKilled(e,t){this.kills+=1,this.score+=Math.round(e.stats.score*this.combo),this.combo=Math.min(8,this.combo+.15),this.peakCombo=Math.max(this.peakCombo,this.combo),this.comboTimer=3.2;let n=e.stats.kind;this.player.addUltCharge(this.player.stats.ultChargePerKill*(n===`boss`?12:n===`elite`?2.5:1)),this.audio.kill(),this.combatMods.railHeatRefund&&t?.sourceWeapon===`rail`&&this.player.coolHeat(this.player.stats.maxHeat*.2),this.combatMods.arcChain>0&&n!==`boss`&&this.combat.spawnArcChains(e.group.position,this.combatMods.arcChain);let r=e.group.position;n===`boss`?this.vfx.killBoss(r):n===`elite`?this.vfx.killElite(r):n===`ranged`?this.vfx.killRanged(r):this.vfx.killChaser(r),this.decals.spawnScorch(r),(n===`elite`||n===`boss`)&&(this.decals.spawnImpact(r,`#f59e0b`),this.worldFx.triggerPulse(r,n===`boss`?`#f43f5e`:`#f59e0b`,7));let i=Math.round(e.stats.score*this.combo);if(this.hud.popScore(i),this.feel.triggerHitstop(n===`boss`?.14:n===`elite`?.09:.05),this.feel.triggerFovPunch(n===`boss`?5:n===`elite`?2.5:1.2),n===`boss`&&this.feel.triggerSlowmo(.55,.35),n===`boss`||n===`elite`||n===`ranged`){let e=n===`boss`?Q().killBoss:n===`elite`?Q().killElite:Q().killRanged;this.hud.pushKillFeed(e,n)}else this.kills%5==0&&this.hud.pushKillFeed(Q().killCount(this.kills),`chaser`);this.player.ultCharge>=100&&this.player.ultCharge-this.player.stats.ultChargePerKill<100&&this.hud.pushKillFeed(Q().ultReady,`boss`),n===`boss`||n===`elite`?this.dropPickup(r,n===`boss`?`ult`:this.rollPickupKind()):this.rng()<.12&&this.dropPickup(r,this.rollPickupKind())}reviveGodMode(){this.player.alive=!0,this.player.group.visible=!0,this.player.hp=this.player.stats.maxHp,this.player.shield=this.player.stats.maxShield,this.player.invulnTimer=Math.max(this.player.invulnTimer,.4),this.player.heat=0,this.player.overheated=!1,this.mode===`dead`&&(this.mode=`play`)}onPlayerHurt(){if(this.combo=1,this.comboTimer=0,this.audio.hurt(),this.feel.triggerHurtFlash(.9),this.feel.triggerHitstop(.08),this.feel.triggerFovPunch(3),this.vfx.addTrauma(.45),this.vfx.spawnBurst(this.player.group.position.clone().setY(.7),`#ff4d6d`,10,6),!this.player.alive){if(this.debugFlags.godMode){this.reviveGodMode();return}this.mode=`dead`,this.audio.death(),this.vfx.spawnShockwave(this.player.group.position,`#ff4d6d`,10),this.feel.triggerHitstop(.18)}}recordShots(e,t){this.shotsFired+=e,this.shotsByWeapon[t]=(this.shotsByWeapon[t]??0)+e}recordDamage(e,t){this.damageDealt+=e,this.hitsLanded+=1,t&&(this.damageByWeapon[t]=(this.damageByWeapon[t]??0)+e)}frameMsSnapshot(){if(this.frameTimes.length===0)return{p50:16.7,p95:16.7,p99:16.7};let e=this.frameTimes.map(e=>e*1e3).sort((e,t)=>e-t),t=t=>{let n=Math.min(e.length-1,Math.max(0,Math.ceil(t/100*e.length)-1));return Number(e[n].toFixed(2))};return{p50:t(50),p95:t(95),p99:t(99)}}setWeapon(e){if(this.weapon===e)return;this.weapon=e,this.combatBuild.weapon=e,this.syncWeaponStats(),this.player.setWeaponVisual(e);let t=To[e],n=ra(e);this.hud.setActiveWeapon(e),this.hud.flashPickup(n,t.color),this.hud.pushKillFeed(Q().weaponPick(ia(e)),`ranged`),this.vfx.spawnBurst(this.player.muzzle,t.color,6,4),this.audio.pickupChain(1),this.publishDiagnostics()}syncWeaponStats(){let e=zo(this.combatBuild,this.weapon);this.player.stats.fireInterval=e.fireInterval,this.player.stats.heatPerShot=e.heatPerShot,this.player.stats.projectileSpeed=e.projectileSpeed,this.player.stats.projectileDamage=e.damage}updateBossPhase(e){let t=e.hp/e.maxHp,n=Go(this.bossRuntime,t);if(e.bossPhaseColor=n.phase.color,!n.changed)return;let r=na(n.phase.id);this.hud.showWaveBanner(Q().titanName(r),!0),this.hud.pushKillFeed(Q().bossPhase(n.phase.id,r),`boss`),this.feel.triggerHitstop(.12),this.feel.triggerFovPunch(5),this.worldFx.triggerPulse(e.group.position,n.phase.color,8),this.vfx.spawnBurst(e.group.position.clone().setY(.8),n.phase.color,22,8)}tickBossLogic(e){let t=this.waves.boss;if(!t){this.lastBossRef=null;return}t!==this.lastBossRef&&(this.bossRuntime=Ho(),this.lastBossRef=t),this.updateBossPhase(t);let n=Wo(this.bossRuntime.phase);if(t.bossPhaseColor=n.color,t.moveSpeedMul=n.moveSpeedMul,t.fireIntervalMul=n.fireIntervalMul,this.bossRuntime.summonTimer-=e,this.bossRuntime.summonTimer<=0&&n.summonCount>0){this.bossRuntime.summonTimer=n.summonEvery;for(let e=0;e<n.summonCount;e+=1)this.waves.forceSpawnNear(t.group.position,`chaser`);this.hud.pushKillFeed(Q().titanReinforcements,`boss`)}if(n.ringEvery>0&&(this.bossRuntime.ringTimer-=e,this.bossRuntime.ringTimer<=0)){this.bossRuntime.ringTimer=n.ringEvery;let e=t.group.position.clone().setY(.55),r=n.id===3?12:8;for(let i=0;i<r;i+=1){let a=this.bossRuntime.spiralAngle+i/r*Math.PI*2,o=new F(Math.cos(a),0,Math.sin(a));this.projectiles.spawn(e,o,t.stats.projectileSpeed*.85,t.stats.projectileDamage*n.projectileDamageMul*.75,`enemy`,n.color)}this.bossRuntime.spiralAngle+=.35,this.vfx.spawnBurst(e,n.color,8,4)}}castUltimate(){this.audio.ult(),this.hud.flashUlt(),this.vfx.ultWarning(this.player.group.position),this.vfx.spawnBurst(this.player.group.position.clone().setY(.5),`#a78bfa`,28,10),this.vfx.addTrauma(.7),this.feel.triggerHitstop(.1),this.feel.triggerFovPunch(6);let e=this.player.stats.ultRadius;for(let t of this.waves.enemies){if(!t.alive)continue;let n=t.group.position.x-this.player.group.position.x,r=t.group.position.z-this.player.group.position.z;n*n+r*r<=e*e&&(t.hitFlash(),t.takeDamage(this.player.stats.ultDamage)&&this.onEnemyKilled(t))}for(let e of this.projectiles.projectiles)e.active&&e.owner===`enemy`&&(this.vfx.spawnBurst(e.group.position,`#a78bfa`,3,4),e.deactivate())}dropPickup(e,t){(this.pickups.find(e=>!e.active)??this.createPickup()).spawn(e,t,this.elapsed)}rollPickupKind(){let e=this.rng();return e<.4?`coolant`:e<.7?`shield`:e<.9?`heal`:`ult`}collectPickup(e){e.collect(),this.pickupChainTimer=1.6,this.pickupChain+=1,this.audio.pickupChain(this.pickupChain);let t={shield:`#3ec6ff`,coolant:`#ffb020`,heal:`#4ade80`,ult:`#a78bfa`},n={shield:Q().pickupShield,coolant:Q().pickupCoolant,heal:Q().pickupHeal,ult:Q().pickupUlt},r=t[e.kind]??`#4ade80`;this.vfx.pickupPop(e.group.position,r),this.decals.spawnImpact(e.group.position,r),this.worldFx.triggerPulse(e.group.position,r,4);let i=this.pickupChain>1?` ×${this.pickupChain}`:``;this.hud.flashPickup(`${n[e.kind]??Q().pickupGeneric}${i}`,r),e.kind===`shield`?this.player.addShield(20):e.kind===`coolant`?this.player.coolHeat(45):e.kind===`heal`?this.player.heal(25):this.player.addUltCharge(25),this.score+=50*this.pickupChain,this.feel.triggerFovPunch(1.2+this.pickupChain*.15)}handlePrimaryAction(){this.mode===`paused`?this.mode=`play`:this.mode===`dead`&&this.restart()}setStressMode(e){this.stressMode=e,this.waves.stressMode=e,this.hud.setStressVisible(e),e&&(this.waves.wave=Math.max(this.waves.wave,8),this.lastWaveShown=0,this.lastEnemyFormTier=Ta(this.waves.wave),this.player.invulnTimer=3,this.waves.forceStartWave(this.player.group.position),this.enemyBatch.sync(this.waves.enemies))}setLowGraphics(e){this.lowGraphics=e,this.tuning.maxDpr=e?1:2,this.postFx?.setLowPower(e),this.postFx?.setEnabled(!e),this.renderer.shadowMap.enabled=!e,this.syncPostSize()}openUpgrade(){this.upgradeOffers=xo(this.upgradeStacks,()=>this.rng(),this.weapon),this.upgradeOffers.length!==0&&(this.mode=`upgrade`,this.hud.showUpgradeCards(this.upgradeOffers.map(e=>{let t=this.upgradeStacks[e.id]??0;return{name:e.name,desc:e.desc,color:e.color,stackLabel:Q().stackLabel(t,t+1)}}),this.waves.wave))}applyUpgrade(e){if(this.mode!==`upgrade`)return;let t=this.upgradeOffers[e];if(!t)return;let n=So(t.id);if(!n)return;if((this.upgradeStacks[t.id]??0)>=n.maxStacks){this.upgradeOffers=[],this.hud.hideUpgradeCards(),this.mode=`play`;return}n.apply({stats:this.player.stats,build:this.combatBuild,mods:this.combatMods}),this.upgradeStacks[t.id]=(this.upgradeStacks[t.id]??0)+1,t.id===`armor`&&this.player.heal(20),t.id===`shield_bank`&&this.player.addShield(15),this.syncWeaponStats(),this.player.overheatEmp=this.combatMods.overheatEmp;let r=ta(t.id);this.hud.flashPickup(r.name,t.color),this.hud.pushKillFeed(Q().modPick(r.name),`ranged`),this.audio.pickupChain(1),this.feel.triggerFovPunch(1.6),this.upgradeOffers=[],this.hud.hideUpgradeCards(),this.mode=`play`,this.refreshPlayerForm(),this.publishDiagnostics()}refreshPlayerForm(){let e=this.upgradeStacks,t=Object.values(e).reduce((e,t)=>e+(t??0),0),n=(e.overclock??0)+(e.mag_accel??0)+(e.arc_capacitor??0)+(e.overheat_cascade??0)+(e.critical_conductor??0)+(e.rail_bore??0)+(e.rail_reactor??0)+(e.scatter_choke??0)+(e.dash_detonation??0),r=(e.armor??0)+(e.shield_bank??0)+(e.shield_nova??0),i=0;t>=12?i=3:t>=7?i=2:t>=3&&(i=1),this.player.setFormTier(i,{weapon:n,defense:r,total:t})}restart(){this.score=0,this.elapsed=0,this.combo=1,this.peakCombo=1,this.comboTimer=0,this.kills=0,this.combatTime=0,this.damageDealt=0,this.shotsFired=0,this.hitsLanded=0;for(let e of Object.keys(this.damageByWeapon))delete this.damageByWeapon[e];for(let e of Object.keys(this.shotsByWeapon))delete this.shotsByWeapon[e];this.frameTimes.length=0,this.lastDeathCause=`unknown`,this.pickupChain=0,this.pickupChainTimer=0,this.mode=`play`,this.lastWaveShown=0,this.lastEnemyFormTier=0,this.rng=Co(this.rngSeed),this.upgradeStacks={},this.upgradeOffers=[],this.weapon=`plasma`,this.player.setWeaponVisual(`plasma`),ko(this.combatMods),Ro(this.combatBuild,this.combatMods),this.bossRuntime=Ho(),this.lastBossRef=null,this.combat.reset(),this.hud.hideUpgradeCards(),this.hud.setActiveWeapon(`plasma`),this.feel.reset(),this.player.reset(),this.player.stats={...Ii,moveSpeed:this.tuning.speed},this.player.dashSpeedMul=this.tuning.dashMultiplier,this.player.moveAccel=this.tuning.acceleration,this.player.overheatEmp=!1,this.syncWeaponStats(),this.player.setFormTier(0),this.projectiles.clear(),this.vfx.reset(),this.worldFx.reset(),this.decals.reset(),this.waves.reset(),this.waves.stressMode=this.stressMode,this.stressMode&&(this.waves.wave=8,this.waves.forceStartWave(this.player.group.position),this.player.invulnTimer=3);for(let e of this.covers)e.reset(90);for(let e of this.pickups)e.reset();this.dropPickup(new F(-8,0,-4),`shield`),this.dropPickup(new F(7,0,3),`coolant`),this.cameraRig.snapTo(this.player.group.position),this.render(),this.publishDiagnostics()}render(){if(this.renderer.info.reset(),!this.postFx?.render()){let e=this.renderer.render(this.scene,this.camera);e&&typeof e.catch==`function`&&e.catch(()=>void 0)}}syncPostSize(){let e=Math.max(1,Math.floor(this.canvas.clientWidth)),t=Math.max(1,Math.floor(this.canvas.clientHeight)),n=Math.min(window.devicePixelRatio||1,this.tuning.maxDpr);Ai(this.backend,this.camera,this.tuning.maxDpr),this.postFx?.setSize(e,t,n)}updateCrosshair(){if(!this.crosshairEl)return;if(this.mode!==`play`||window.matchMedia(`(pointer: coarse)`).matches){this.crosshairEl.style.opacity=`0`;return}this.crosshairEl.style.opacity=`1`;let e=this.canvas.getBoundingClientRect();this.ndc.set(this.tmp.aim.x,this.tmp.aim.y);let t=this.player.group.position.clone().add(new F(this.tmp.aim.x,0,this.tmp.aim.y).multiplyScalar(4));t.project(this.camera);let n=(t.x+1)/2*e.width,r=(-t.y+1)/2*e.height;this.crosshairEl.style.transform=`translate(${n}px, ${r}px) translate(-50%, -50%)`;let i=this.player.overheated?`0.35`:this.player.heat/this.player.stats.maxHeat;this.crosshairEl.style.setProperty(`--heat`,String(i))}applyHurtFlash(){let e=this.feel.getHurtFlash();this.canvas.style.filter=e>.01?`saturate(${1+e*.5}) contrast(${1+e*.25})`:``}applyWaveLighting(e){if(!this.hemiLight||!this.fillLight)return;let t=this.waves.wave,n=D.clamp((t-1)/12,0,1),r=new z(`#9db7d9`).lerp(new z(`#c4a0e0`),n),i=new z(`#1a1410`).lerp(new z(`#201018`),n),a=new z(`#5ec8ff`).lerp(new z(`#ff6b9d`),n*.7);this.hemiLight.color.lerp(r,1-Math.exp(-2*e)),this.hemiLight.groundColor.lerp(i,1-Math.exp(-2*e)),this.fillLight.color.lerp(a,1-Math.exp(-2*e))}createScene(){this.scene.background=new z(`#070b12`),this.scene.fog=new ue(`#070b12`,.016);let e=new _e(`#b7c9e4`,`#241810`,1.15);this.hemiLight=e,this.scene.add(e);let t=new p(`#ffd7a8`,3.6);t.position.set(-8,16,6),t.castShadow=!0,t.shadow.mapSize.set(2048,2048),t.shadow.camera.near=.5,t.shadow.camera.far=42,t.shadow.camera.left=-18,t.shadow.camera.right=18,t.shadow.camera.top=14,t.shadow.camera.bottom=-14,t.shadow.bias=-4e-4,this.scene.add(t);let n=new p(`#5ec8ff`,.85);this.fillLight=n,n.position.set(10,5,-8),this.scene.add(n);let r=new p(`#22d3ee`,.7);r.position.set(0,3,12),this.scene.add(r);let i=new p(`#7dd3fc`,.35);i.position.set(0,-2,0),i.castShadow=!1,this.scene.add(i),this.scene.add(this.createArena()),this.scene.add(this.createSkyline()),this.scene.add(this.createDebris()),this.scene.add(this.createMidProps()),this.createCovers(),this.scene.add(this.player.group);for(let e=0;e<8;e+=1){let t=new Fi(e);this.pickups.push(t),this.scene.add(t.group)}}createMidProps(){let e=new I,t=new h({color:`#243044`,roughness:.7,metalness:.45,emissive:`#0a2030`,emissiveIntensity:.15}),n=new h({color:`#3d4a5c`,roughness:.4,metalness:.7,emissive:`#22d3ee`,emissiveIntensity:.12}),r=new h({color:`#1a2230`,roughness:.85,metalness:.25});for(let[i,a,o,s,c,l]of[[-2.2,-3.8,1.1,.28,.7,0],[2.4,3.6,.9,.22,.9,1],[-6.2,.5,.7,.35,.7,0],[6,-1.2,.8,.3,.55,1],[.5,-6.8,1.4,.18,.45,0],[-1.2,6.5,1.2,.2,.5,1],[4.2,-5.5,.6,.4,.6,2],[-4.5,5.2,.55,.32,.9,2],[8.5,5.8,1,.25,.4,0],[-8.8,-5,.9,.22,.5,1],[3.8,1.5,.45,.5,.45,2],[-3.6,-1,.4,.42,.7,2]]){let u=l===1?n:l===2?r:t,d=new R(o,s,c),f=new y(d,u);if(f.position.set(i,s*.5,a),f.rotation.y=this.rng()*Math.PI,f.castShadow=!0,f.receiveShadow=!0,e.add(f),l!==2){let t=new y(new R(o*.6,.02,.04),new w({color:l?`#22d3ee`:`#f59e0b`,transparent:!0,opacity:.45}));t.position.set(i,s+.01,a),t.rotation.y=f.rotation.y,e.add(t)}}let i=new P(.08,.1,.06,6),a=new h({color:`#4a5568`,roughness:.35,metalness:.8,emissive:`#0a3040`,emissiveIntensity:.2}),o=new R(.55,.04,.55),s=new h({color:`#1c2433`,roughness:.6,metalness:.5}),c=new je(i,a,48),l=new je(o,s,24);c.castShadow=l.castShadow=!1;let u=new M;for(let e=0;e<48;e+=1){let t=this.rng()*Math.PI*2,n=2+this.rng()*10;u.position.set(Math.cos(t)*n,.03,Math.sin(t)*n*.7),u.rotation.set(0,this.rng()*Math.PI,0),u.scale.setScalar(.7+this.rng()*.6),u.updateMatrix(),c.setMatrixAt(e,u.matrix)}for(let e=0;e<24;e+=1){let t=this.rng()*Math.PI*2,n=3+this.rng()*9;u.position.set(Math.cos(t)*n,.02,Math.sin(t)*n*.65),u.rotation.set(0,this.rng()*Math.PI,0),u.scale.set(.8+this.rng()*.5,1,.8+this.rng()*.5),u.updateMatrix(),l.setMatrixAt(e,u.matrix)}c.instanceMatrix.needsUpdate=!0,l.instanceMatrix.needsUpdate=!0,e.add(c,l);let d=new w({color:`#22d3ee`,transparent:!0,opacity:.12,side:2,depthWrite:!1}),f=new Ke(1.1,1.25,6);for(let[t,n]of[[0,0],[-7,0],[7,0],[0,-5.5],[0,5.5]]){let r=new y(f,d);r.rotation.x=-Math.PI/2,r.rotation.z=Math.PI/6,r.position.set(t,.015,n),e.add(r)}return e}createDebris(){let e=new I,t=new h({color:`#1a2230`,roughness:.9,metalness:.2}),n=new h({color:`#3d4a5c`,roughness:.45,metalness:.7,emissive:`#0a3040`,emissiveIntensity:.2});for(let[r,i,a,o,s]of[[-11.5,-6.5,1.4,.55,.9],[11.2,6.2,1.1,.4,1.3],[-10.8,5.8,.7,.9,.7],[10.5,-6,.8,.35,1.6],[-6.5,7.8,1.8,.25,.5],[7.2,-7.5,1.5,.3,.6]]){let c=new R(a,o,s),l=new y(c,this.rng()>.5?t:n);l.position.set(r,o*.5,i),l.rotation.y=this.rng()*Math.PI,l.rotation.z=(this.rng()-.5)*.2,l.castShadow=!0,l.receiveShadow=!0,e.add(l)}let r=new P(.28,.38,1.6,6),i=new y(r,n);return i.position.set(-12.2,.5,1.5),i.rotation.z=.35,i.castShadow=!0,e.add(i),e}createSkyline(){let e=new I,t=new h({color:`#101826`,roughness:.85,metalness:.15,emissive:`#0a2038`,emissiveIntensity:.35}),n=new w({color:`#22d3ee`}),r=new R(1,1,1),i=new R(.14,.2,.02),a=new je(r,t,28);a.castShadow=!1,a.receiveShadow=!1;let o=[],s=new M;for(let e=0;e<28;e+=1){let t=e/28*Math.PI*2,n=22+e%5*1.4,r=3+e*17%9,i=1.2+e*13%5*.25;s.position.set(Math.cos(t)*n,r/2,Math.sin(t)*n),s.scale.set(i,r,i),s.rotation.set(0,-t,0),s.updateMatrix(),a.setMatrixAt(e,s.matrix);for(let a=0;a<3;a+=1)(e+a)%3!=0&&(s.position.set(Math.cos(t)*(n-i*.52),.6+r/4*a,Math.sin(t)*(n-i*.52)),s.scale.set(1,1,1),s.lookAt(0,s.position.y,0),s.updateMatrix(),o.push(s.matrix.clone()))}a.instanceMatrix.needsUpdate=!0,e.add(a);let c=new je(i,n,o.length);return o.forEach((e,t)=>c.setMatrixAt(t,e)),c.instanceMatrix.needsUpdate=!0,e.add(c),e}createArena(){let e=new I,t=this.createFloorTexture();t.wrapS=V,t.wrapT=V,t.repeat.set($.halfWidth/2.2,$.halfDepth/2.2);let n=this.createFloorRoughnessTexture();n.wrapS=V,n.wrapT=V,n.repeat.copy(t.repeat);let r=new y(new Ge($.halfWidth*2,$.halfDepth*2,1,1),new h({color:`#1c2433`,map:t,roughnessMap:n,roughness:.92,metalness:.18}));r.rotation.x=-Math.PI/2,r.receiveShadow=!0,e.add(r);let i=new Ce({color:`#1e3a5f`}),a=[];for(let e=-$.halfWidth;e<=$.halfWidth;e+=2)a.push(new F(e,.02,-$.halfDepth)),a.push(new F(e,.02,$.halfDepth));for(let e=-$.halfDepth;e<=$.halfDepth;e+=2)a.push(new F(-$.halfWidth,.02,e)),a.push(new F($.halfWidth,.02,e));let o=new Ye().setFromPoints(a);e.add(new oe(o,i));let s=new h({color:`#243044`,roughness:.45,metalness:.7,emissive:`#0a4050`,emissiveIntensity:.25}),c=new w({color:`#22d3ee`,transparent:!0,opacity:.35}),l=new R($.halfWidth*2+.8,.55,.35),u=new R(.35,.55,$.halfDepth*2+.8),d=[new y(l,s),new y(l,s),new y(u,s),new y(u,s)];d[0].position.set(0,.28,-$.halfDepth-.2),d[1].position.set(0,.28,$.halfDepth+.2),d[2].position.set(-$.halfWidth-.2,.28,0),d[3].position.set($.halfWidth+.2,.28,0);for(let t of d)t.castShadow=!0,t.receiveShadow=!0,e.add(t);let f=new R($.halfWidth*2+.6,.04,.08),p=new R(.08,.04,$.halfDepth*2+.6),m=new y(f,c);m.position.set(0,.56,-$.halfDepth-.2);let g=new y(f,c);g.position.set(0,.56,$.halfDepth+.2);let _=new y(p,c);_.position.set(-$.halfWidth-.2,.56,0);let v=new y(p,c);v.position.set($.halfWidth+.2,.56,0),e.add(m,g,_,v);let b=new I,x=new y(new Ke(1.55,1.72,6),new w({color:`#22d3ee`,transparent:!0,opacity:.4,side:2,depthWrite:!1}));x.rotation.x=-Math.PI/2,x.rotation.z=Math.PI/6,x.position.y=.02;let S=new y(new Ke(1.95,2.05,48),new w({color:`#7ae7ff`,transparent:!0,opacity:.25,side:2,depthWrite:!1}));S.rotation.x=-Math.PI/2,S.position.y=.018;let C=new y(new Ne(.55,6),new w({color:`#22d3ee`,transparent:!0,opacity:.14,side:2,depthWrite:!1}));C.rotation.x=-Math.PI/2,C.rotation.z=Math.PI/6,C.position.y=.016,b.add(x,S,C),e.add(b);let T=new R(.55,.06,.14),E=new w({color:`#fbbf24`,transparent:!0,opacity:.55}),D=new je(T,E,36);D.frustumCulled=!1;{let e=new M,t=0,n=(n,r,i)=>{e.position.set(n,.03,r),e.rotation.set(0,i,0),e.updateMatrix(),D.setMatrixAt(t,e.matrix),t+=1},r=$.halfWidth-.4,i=$.halfDepth-.4;for(let e=0;e<9;e+=1){let t=e/8*2-1;n(t*r,-i,0),n(t*r,i,Math.PI),n(-r,t*i,Math.PI/2),n(r,t*i,-Math.PI/2)}D.instanceMatrix.needsUpdate=!0}e.add(D);let O=new P(.25,.35,2.2,6),k=new h({color:`#243044`,roughness:.45,metalness:.5,emissive:`#1ec8df`,emissiveIntensity:.35});for(let[t,n]of[[-$.halfWidth+1.2,-$.halfDepth+1.2],[$.halfWidth-1.2,-$.halfDepth+1.2],[-$.halfWidth+1.2,$.halfDepth-1.2],[$.halfWidth-1.2,$.halfDepth-1.2]]){let r=new y(O,k);r.position.set(t,1.1,n),r.castShadow=!0,e.add(r)}return e}createCovers(){for(let[e,t,n,r,i]of[[-5,-2.5,2.4,1.2,1.1],[5,2.5,2.4,1.2,1.1],[0,-5.2,1.4,2.2,1.3],[0,5.2,1.4,2.2,1.3],[-8,2.8,1.2,1.2,.9],[8,-2.8,1.2,1.2,.9],[-3.5,0,1,2.8,1],[3.5,0,1,2.8,1]]){let a=new Ni(new F(e,0,t),new F(n,i,r),90,()=>this.rng());this.covers.push(a),this.scene.add(a.mesh)}}createPickup(){let e=new Fi(this.pickups.length);return this.pickups.push(e),this.scene.add(e.group),e}createFloorRoughnessTexture(){let e=document.createElement(`canvas`);e.width=256,e.height=256;let t=e.getContext(`2d`);if(!t)throw Error(`roughness tex`);t.fillStyle=`#b0b0b0`,t.fillRect(0,0,256,256),t.fillStyle=`#707070`;for(let e=0;e<6;e+=1){let e=this.rng()*256,n=this.rng()*256;t.fillRect(e,n,40+this.rng()*80,18+this.rng()*30)}for(let e=0;e<500;e+=1)t.fillStyle=`rgba(255,255,255,${.05+this.rng()*.1})`,t.fillRect(this.rng()*256,this.rng()*256,2+this.rng()*4,2);let n=new Re(e);return n.colorSpace=``,n}createFloorTexture(){let e=document.createElement(`canvas`);e.width=512,e.height=512;let t=e.getContext(`2d`);if(!t)throw Error(`Could not create floor texture context.`);t.fillStyle=`#151a22`,t.fillRect(0,0,512,512);for(let e=0;e<18;e+=1){let e=this.rng()*512,n=this.rng()*512,r=40+this.rng()*90,i=t.createRadialGradient(e,n,0,e,n,r),a=this.rng()>.6;i.addColorStop(0,a?`rgba(60,45,30,0.18)`:`rgba(20,40,60,0.2)`),i.addColorStop(1,`rgba(0,0,0,0)`),t.fillStyle=i,t.beginPath(),t.arc(e,n,r,0,Math.PI*2),t.fill()}t.strokeStyle=`rgba(0,0,0,0.35)`,t.lineWidth=2;for(let e=0;e<=512;e+=64)t.beginPath(),t.moveTo(e,0),t.lineTo(e,512),t.moveTo(0,e),t.lineTo(512,e),t.stroke();t.strokeStyle=`rgba(120,150,180,0.08)`,t.lineWidth=1;for(let e=0;e<=512;e+=64)t.beginPath(),t.moveTo(e+1,0),t.lineTo(e+1,512),t.stroke();t.strokeStyle=`rgba(34, 211, 238, 0.12)`,t.lineWidth=1,t.setLineDash([8,16]),t.beginPath(),t.moveTo(256,0),t.lineTo(256,512),t.stroke(),t.setLineDash([]);for(let e=0;e<5e3;e+=1){let e=this.rng()*512,n=this.rng()*512,r=.02+this.rng()*.06;t.fillStyle=this.rng()>.5?`rgba(200,220,255,${r})`:`rgba(0,0,0,${r*1.4})`,t.fillRect(e,n,1.2,1.2)}for(let e=0;e<14;e+=1){let e=this.rng()*512,n=this.rng()*512,r=18+this.rng()*45,i=t.createRadialGradient(e,n,0,e,n,r);i.addColorStop(0,`rgba(25,15,10,0.35)`),i.addColorStop(1,`rgba(25,15,10,0)`),t.fillStyle=i,t.beginPath(),t.arc(e,n,r,0,Math.PI*2),t.fill()}let n=new Re(e);return n.colorSpace=De,n.anisotropy=4,n}pushHud(e){let t=this.waves.getState(),n=this.waves.boss,r=Q(),i=this.mode===`dead`?r.statusDead:this.mode===`upgrade`?r.statusUpgrade:this.player.overheated?r.statusCooling:n?r.statusBoss:this.stressMode?r.statusStress:t.intermission>0?r.statusInbound:r.statusHold;this.hud.update({hp:this.player.hp,maxHp:this.player.stats.maxHp,shield:this.player.shield,maxShield:this.player.stats.maxShield,heat:this.player.heat,maxHeat:this.player.stats.maxHeat,overheated:this.player.overheated,wave:t.wave,score:this.score,combo:this.combo,enemies:t.alive,ult:this.player.ultCharge,time:this.elapsed,status:i,boss:{visible:!!n,hpRatio:n?n.hp/n.maxHp:0,name:n?r.titanName(na(this.bossRuntime.phase)):`TITAN-07`},waveBanner:null,mode:this.mode,peakCombo:this.peakCombo,kills:this.kills,deathCause:this.lastDeathCause,stress:this.stressMode,lowGraphics:this.lowGraphics,weapon:this.weapon},e),this.hud.updatePerf(this.fps,this.renderer.info.render.calls,this.renderer.info.render.triangles,t.alive)}installTestHooks(){window.__THREE_GAME_TEST_HOOKS__={seed:e=>{this.rngSeed=e,this.rng=Co(e)},setState:e=>{if(e!==`active-play`&&e!==`complete`&&e!==`stress`)throw Error(`Unknown test state: ${e}`);return this.restart(),e===`complete`&&(this.score=12800,this.elapsed=95,this.combo=3.5,this.peakCombo=4.2,this.player.ultCharge=100,this.kills=87,this.mode=`play`),e===`stress`&&(this.setStressMode(!0),this.restart(),this.setStressMode(!0),this.enemyBatch.sync(this.waves.enemies),this.pushHud(0)),this.render(),this.publishDiagnostics(),{state:e}},setPausedForScreenshot:e=>{this.pausedForScreenshot=e},setReducedMotion:e=>{this.reducedMotion=e,e&&this.player.stabilizeVisuals(),this.render(),this.publishDiagnostics()},hideDebugUi:e=>{this.debugTools.setHidden(e),this.hud.setPerfVisible(!e)},pickUpgrade:e=>(this.applyUpgrade(e),{mode:this.mode}),grantUpgrade:e=>{let t=So(e);return t?(t.apply({stats:this.player.stats,build:this.combatBuild,mods:this.combatMods}),this.upgradeStacks[e]=(this.upgradeStacks[e]??0)+1,this.syncWeaponStats(),this.player.overheatEmp=this.combatMods.overheatEmp,this.publishDiagnostics(),{ok:!0,weapon:this.weapon}):{ok:!1}},getBuildSnapshot:()=>{let e=zo(this.combatBuild,this.weapon);return{weapon:this.weapon,fireInterval:e.fireInterval,damage:e.damage,projectileSpeed:e.projectileSpeed,pierce:e.pierce,spread:e.spread,modifiers:Ao(this.combatMods),stacks:{...this.upgradeStacks}}}}}publishDiagnostics(){let e=this.renderer.info,t=this.waves.getState();window.__THREE_GAME_DIAGNOSTICS__=Ko({frame:this.frame,elapsed:this.elapsed,score:this.score,mode:this.mode,wave:t.wave,enemies:t.alive,combo:this.combo,peakCombo:this.peakCombo,fps:this.fps,kills:this.kills,stress:this.stressMode,upgradeStacks:{...this.upgradeStacks},weapon:this.weapon,modifiers:Ao(this.combatMods),bossPhase:this.waves.boss?this.bossRuntime.phase:null,playerFormTier:this.player.getFormTier(),enemyFormTier:Ta(t.wave),projectiles:this.projectiles.activeCount(),particles:this.vfx.activeCount(),backend:this.backend.kind,webgpuSupported:this.backend.webgpuSupported,combatTime:this.combatTime,damageDealt:this.damageDealt,shotsFired:this.shotsFired,hitsLanded:this.hitsLanded,dps:this.combatTime>.05?Number((this.damageDealt/this.combatTime).toFixed(2)):0,killsPerSec:this.combatTime>.05?Number((this.kills/this.combatTime).toFixed(2)):0,frameMs:this.frameMsSnapshot(),player:{hp:this.player.hp,shield:this.player.shield,heat:this.player.heat,overheated:this.player.overheated,ult:this.player.ultCharge,alive:this.player.alive,fireInterval:this.player.stats.fireInterval,projectileDamage:this.player.stats.projectileDamage,projectileSpeed:this.player.stats.projectileSpeed,heatPerShot:this.player.stats.heatPerShot,speed:this.player.velocity.length(),position:{x:this.player.group.position.x,y:this.player.group.position.y,z:this.player.group.position.z}},renderer:{calls:e.render.calls,triangles:e.render.triangles,geometries:e.memory.geometries,textures:e.memory.textures},canvas:{clientWidth:this.canvas.clientWidth,clientHeight:this.canvas.clientHeight,width:this.canvas.width,height:this.canvas.height,dpr:Math.min(window.devicePixelRatio||1,this.tuning.maxDpr)}})}getElement(e){let t=document.querySelector(e);if(!t)throw Error(`Missing element: ${e}`);return t}};aa();var $o=document.querySelector(`#game-canvas`);if(!$o)throw Error(`Missing #game-canvas element.`);var es=new URLSearchParams(window.location.search),ts=es.get(`renderer`)===`webgpu`||es.get(`renderer`)===`webgpu-premium`,ns;if(ts&&typeof navigator<`u`&&`gpu`in navigator){let e=await Di($o);await ki(e),ns=new Qo($o,e)}else ns=new Qo($o);ns.start();
//# sourceMappingURL=index-Cec8Z_YL.js.map