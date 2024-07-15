package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Item {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "sprice")
    private BigDecimal sprice;
    @Basic
    @Column(name = "pprice")
    private BigDecimal pprice;
    @Basic
    @Column(name = "poto")
    private byte[] poto;
    @Basic
    @Column(name = "quantity")
    private Integer quantity;
    @Basic
    @Column(name = "rop")
    private Integer rop;
    @Basic
    @Column(name = "dointroduced")
    private Date dointroduced;
    @ManyToOne
    @JoinColumn(name = "subcategory_id", referencedColumnName = "id", nullable = false)
    private Subcategory subcategory;
    @ManyToOne
    @JoinColumn(name = "itembrand_id", referencedColumnName = "id", nullable = false)
    private Itembrand itembrand;
    @ManyToOne
    @JoinColumn(name = "itemstatus_id", referencedColumnName = "id", nullable = false)
    private Itemstatus itemstatus;
    @ManyToOne
    @JoinColumn(name = "unittype_id", referencedColumnName = "id", nullable = false)
    private Unittype unittype;
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id", nullable = false)
    private Supplier supplier;
    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private Collection<Poitem> poitems;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getSprice() {
        return sprice;
    }

    public void setSprice(BigDecimal sprice) {
        this.sprice = sprice;
    }

    public BigDecimal getPprice() {
        return pprice;
    }

    public void setPprice(BigDecimal pprice) {
        this.pprice = pprice;
    }

    public byte[] getPoto() {
        return poto;
    }

    public void setPoto(byte[] poto) {
        this.poto = poto;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getRop() {
        return rop;
    }

    public void setRop(Integer rop) {
        this.rop = rop;
    }

    public Date getDointroduced() {
        return dointroduced;
    }

    public void setDointroduced(Date dointroduced) {
        this.dointroduced = dointroduced;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Item item = (Item) o;
        return id == item.id && Objects.equals(name, item.name) && Objects.equals(sprice, item.sprice) && Objects.equals(pprice, item.pprice) && Arrays.equals(poto, item.poto) && Objects.equals(quantity, item.quantity) && Objects.equals(rop, item.rop) && Objects.equals(dointroduced, item.dointroduced);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, name, sprice, pprice, quantity, rop, dointroduced);
        result = 31 * result + Arrays.hashCode(poto);
        return result;
    }

    public Subcategory getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(Subcategory subcategory) {
        this.subcategory = subcategory;
    }

    public Itembrand getItembrand() {
        return itembrand;
    }

    public void setItembrand(Itembrand itembrand) {
        this.itembrand = itembrand;
    }

    public Itemstatus getItemstatus() {
        return itemstatus;
    }

    public void setItemstatus(Itemstatus itemstatus) {
        this.itemstatus = itemstatus;
    }

    public Unittype getUnittype() {
        return unittype;
    }

    public void setUnittype(Unittype unittype) {
        this.unittype = unittype;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Collection<Poitem> getPoitems() {
        return poitems;
    }

    public void setPoitems(Collection<Poitem> poitems) {
        this.poitems = poitems;
    }
}
