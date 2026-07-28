import { ArrowRight, ShieldCheck, Star, Truck } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-blue-400 font-semibold">
              Welcome to Vistora
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Everything you need,
              <span className="block text-blue-500">
                all in one place.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-zinc-400 text-lg leading-8">
              Explore electronics, fashion, footwear, accessories and
              everyday products at affordable prices.
            </p>

            <a
              href="#products"
              className="inline-flex items-center gap-2 mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Shop Now
              <ArrowRight size={19} />
            </a>
          </div>

          {/* Right */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
              alt="Vistora store"
              className="w-full h-[360px] sm:h-[420px] object-cover"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="w-11 h-11 rounded-lg bg-blue-600/15 text-blue-400 flex items-center justify-center shrink-0">
              <Truck size={21} />
            </div>

            <div>
              <h3 className="font-bold">
                Fast Delivery
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Quick and reliable shipping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="w-11 h-11 rounded-lg bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h3 className="font-bold">
                Secure Payment
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Protected transactions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="w-11 h-11 rounded-lg bg-amber-600/15 text-amber-400 flex items-center justify-center shrink-0">
              <Star size={21} />
            </div>

            <div>
              <h3 className="font-bold">
                Quality Products
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Carefully selected items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="w-11 h-11 rounded-lg bg-emerald-600/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Star size={21} />
            </div>

            <div>
              <h3 className="font-bold">
                Trusted Store
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Loved by customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;