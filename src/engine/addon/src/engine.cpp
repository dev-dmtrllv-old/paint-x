#include <napi.h>
#include <string>

std::string hello()
{
	return "Hello from c++!";
}

Napi::String wrappedHello(const Napi::CallbackInfo &info)
{
	return Napi::String::New(info.Env(), hello());
}

Napi::Object ExposeExports(Napi::Env env, Napi::Object exports)
{
	exports.Set("hello", Napi::Function::New(env, wrappedHello));
	return exports;
}

NODE_API_MODULE(cppengine, ExposeExports)
